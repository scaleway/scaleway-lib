import { StatusEnum } from '../constants'
import DataLoader from '../dataloader'

const PROMISE_TIMEOUT = 100

const fakeSuccessPromise = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), PROMISE_TIMEOUT)
  })

const fakeErrorPromise = () =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('test')), PROMISE_TIMEOUT)
  })

describe('Dataloader class', () => {
  test('should create instance not enabled then launch then destroy', async () => {
    const notify = jest.fn()
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test',
      method,
      notify,
    })
    expect(instance.status).toBe(StatusEnum.IDLE)
    expect(notify).toBeCalledTimes(0)
    expect(method).toBeCalledTimes(0)
    await instance.launch()
    expect(method).toBeCalledTimes(1)
    expect(notify).toBeCalledTimes(2)
    instance.destroy()
  })

  test('should create instance enabled then launch', async () => {
    const notify = jest.fn()
    const method = jest.fn()
    const instance = new DataLoader({
      enabled: true,
      key: 'test',
      method,
      notify,
    })
    expect(instance.status).toBe(StatusEnum.LOADING)
    expect(notify).toBeCalledTimes(0)
    expect(method).toBeCalledTimes(0)
    await instance.launch()
    // This does nothing because no cancel listener is set
    await instance.cancel()
    expect(method).toBeCalledTimes(1)
    expect(notify).toBeCalledTimes(1)
  })

  test('should create instance with cancel listener', async () => {
    const notify = jest.fn()
    const method = jest.fn()
    const onCancel = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
      notify,
    })
    instance.addOnCancelListener(onCancel)
    instance.addOnCancelListener(onCancel)
    // eslint-disable-next-line no-void
    void instance.launch()
    await instance.cancel()
    expect(onCancel).toBeCalledTimes(1)
    instance.removeOnCancelListener(onCancel)
    instance.removeOnCancelListener(onCancel)
  })

  test('should create instance with success listener', async () => {
    const notify = jest.fn()
    const method = jest.fn(fakeSuccessPromise)
    const onSuccess = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
      notify,
    })
    instance.addOnSuccessListener(onSuccess)
    instance.addOnSuccessListener(onSuccess)
    await instance.launch()
    expect(onSuccess).toBeCalledTimes(1)
    instance.removeOnSuccessListener(onSuccess)
    instance.removeOnSuccessListener(onSuccess)
  })

  test('should create instance with error listener', async () => {
    const notify = jest.fn()
    const method = jest.fn(fakeErrorPromise)
    const onError = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
      notify,
    })
    instance.addOnErrorListener(onError)
    instance.addOnErrorListener(onError)
    await instance.launch()
    expect(onError).toBeCalledTimes(1)
    expect(instance.error?.message).toBe('test')
    instance.removeOnErrorListener(onError)
    instance.removeOnErrorListener(onError)
  })

  test('should create instance with polling', async () => {
    const notify = jest.fn()
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test',
      method,
      notify,
      pollingInterval: PROMISE_TIMEOUT,
    })
    await instance.launch()
    expect(method).toBeCalledTimes(1)
    await instance.launch()
    expect(method).toBeCalledTimes(2)
    await new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT * 2))
    expect(method).toBeCalledTimes(3)
    await instance.launch()
    instance.destroy()
  })
})
