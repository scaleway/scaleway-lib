import { StatusEnum } from '../constants'
import DataLoader from '../dataloader'

const PROMISE_TIMEOUT = 100

const fakeSuccessPromise = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), PROMISE_TIMEOUT)
  })

const fakeNullPromise = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(null), PROMISE_TIMEOUT)
  })
const fakeUndefinedPromise = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(undefined), PROMISE_TIMEOUT)
  })

const fakeErrorPromise = () =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('test')), PROMISE_TIMEOUT)
  })

describe('Dataloader class', () => {
  test('should create instance not enabled then load then destroy', async () => {
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test',
      method,
    })
    expect(instance.status).toBe(StatusEnum.IDLE)
    expect(method).toBeCalledTimes(0)
    await instance.load()
    expect(method).toBeCalledTimes(1)
    instance.destroy()
    instance.clearData()
  })

  test('should create instance enabled with cancel', async () => {
    const notify = jest.fn()
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      enabled: true,
      key: 'test',
      method,
    })
    instance.addObserver(notify)
    expect(instance.status).toBe(StatusEnum.LOADING)
    expect(instance.getData()).toBe(undefined)
    expect(notify).toBeCalledTimes(0)
    expect(method).toBeCalledTimes(1)
    await instance.cancel()
    await new Promise(resolve =>
      setTimeout(() => {
        expect(notify).toBeCalledTimes(1)
        resolve(true)
      }, PROMISE_TIMEOUT),
    )
    expect(instance.getData()).toBe(undefined)
    instance.clearData()
  })

  test('should create instance enabled without cancel', async () => {
    const notify = jest.fn()
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      enabled: true,
      key: 'test',
      method,
    })
    instance.addObserver(notify)
    expect(instance.status).toBe(StatusEnum.LOADING)
    expect(notify).toBeCalledTimes(0)
    expect(method).toBeCalledTimes(1)
    await new Promise(resolve =>
      setTimeout(() => {
        expect(notify).toBeCalledTimes(1)
        resolve(true)
      }, PROMISE_TIMEOUT),
    )
    expect(instance.getData()).toBe(true)
    instance.getObserversCount()
    instance.removeObserver(notify)
    instance.removeObserver(notify)
    instance.clearData()
  })

  test('should create instance enabled with null data', async () => {
    const method = jest.fn(fakeNullPromise)
    const instance = new DataLoader({
      enabled: true,
      key: 'test',
      method,
    })
    expect(instance.status).toBe(StatusEnum.LOADING)
    expect(method).toBeCalledTimes(1)
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true)
      }, PROMISE_TIMEOUT),
    )
    expect(instance.getData()).toBe(undefined)
  })
  test('should create instance enabled with undefined data', async () => {
    const method = jest.fn(fakeUndefinedPromise)
    const instance = new DataLoader({
      enabled: true,
      key: 'test',
      method,
    })
    expect(instance.status).toBe(StatusEnum.LOADING)
    expect(method).toBeCalledTimes(1)
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true)
      }, PROMISE_TIMEOUT),
    )
    expect(instance.getData()).toBe(undefined)
  })

  test('should create instance with cancel listener and success', async () => {
    const method = jest.fn(fakeSuccessPromise)
    const onCancel = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
    })
    instance.addOnCancelListener(onCancel)
    instance.addOnCancelListener(onCancel)
    // eslint-disable-next-line no-void
    void instance.load()
    await instance.cancel()
    expect(onCancel).toBeCalledTimes(1)
    instance.removeOnCancelListener(onCancel)
    instance.removeOnCancelListener(onCancel)
  })

  test('should create instance with cancel listener and error', async () => {
    const method = jest.fn(fakeErrorPromise)
    const onCancel = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
    })
    instance.addOnCancelListener(onCancel)
    instance.addOnCancelListener(onCancel)
    // eslint-disable-next-line no-void
    void instance.load()
    await instance.cancel()
    expect(onCancel).toBeCalledTimes(1)
    instance.removeOnCancelListener(onCancel)
    instance.removeOnCancelListener(onCancel)
  })

  test('should create instance with success listener', async () => {
    const method = jest.fn(fakeSuccessPromise)
    const onSuccess = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
    })
    instance.addOnSuccessListener(onSuccess)
    instance.addOnSuccessListener(onSuccess)
    await instance.load()
    expect(onSuccess).toBeCalledTimes(1)
    instance.removeOnSuccessListener(onSuccess)
    instance.removeOnSuccessListener(onSuccess)
  })

  test('should create instance with error listener', async () => {
    const method = jest.fn(fakeErrorPromise)
    const onError = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
    })
    instance.addOnErrorListener(onError)
    instance.addOnErrorListener(onError)
    await instance.load()
    expect(onError).toBeCalledTimes(1)
    expect(instance.error?.message).toBe('test')
    instance.removeOnErrorListener(onError)
    instance.removeOnErrorListener(onError)
  })

  test('should create instance with polling', async () => {
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test',
      method,
      pollingInterval: PROMISE_TIMEOUT * 2,
    })
    await instance.load()
    expect(method).toBeCalledTimes(1)
    await new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT * 3))
    expect(method).toBeCalledTimes(2)
    await new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT * 3))
    expect(method).toBeCalledTimes(3)
    await instance.load()
    await instance.load()
    await new Promise(resolve => setTimeout(resolve))
    expect(method).toBeCalledTimes(4)
    await instance.load()
    await instance.load()
    await instance.load(true)
    await new Promise(resolve => setTimeout(resolve))
    expect(method).toBeCalledTimes(6)
    instance.destroy()
  })

  test('should update outdated data', async () => {
    const method = jest.fn(fakeSuccessPromise)
    const onSuccess = jest.fn()
    const instance = new DataLoader({
      enabled: true,
      key: 'test',
      maxDataLifetime: PROMISE_TIMEOUT,
      method,
    })
    instance.addOnSuccessListener(onSuccess)
    expect(instance.status).toBe(StatusEnum.LOADING)
    expect(method).toBeCalledTimes(1)
    await new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT))
    expect(onSuccess).toBeCalledTimes(1)
    await instance.load()
    expect(method).toBeCalledTimes(1)
    expect(onSuccess).toBeCalledTimes(1)
    await new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT * 2))
    await instance.load()
    expect(method).toBeCalledTimes(2)
    expect(onSuccess).toBeCalledTimes(2)
  })

  test('should launch 2 concurrent requests', async () => {
    const method = jest.fn(fakeSuccessPromise)
    DataLoader.maxConcurrent = 2
    for (let i = 0; i < 5; i += 1) {
      const instance = new DataLoader({
        enabled: true,
        key: `test-${i}`,
        method,
      })
      expect(instance.status).toBe(StatusEnum.LOADING)
    }
    // Because wait for setTimeout tryLaunch in dataloader.ts
    await new Promise(resolve => setTimeout(resolve))
    expect(method).toBeCalledTimes(2)
  })
})
