import waitForExpect from 'wait-for-expect'
import DataLoader from '../dataloader'

const PROMISE_TIMEOUT = 100

const fakeSuccessPromise = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), PROMISE_TIMEOUT)
  })

const fakeLongSuccessPromise = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), 200)
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
  test('should create instance then load then destroy', async () => {
    const method = jest.fn(fakeSuccessPromise)
    const notifyChanges = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
      notifyChanges,
    })
    expect(method).toBeCalledTimes(0)
    await instance.load()
    expect(method).toBeCalledTimes(1)
    instance.clearData()
  })

  test('should create instance with cancel', () => {
    const notify = jest.fn()
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test',
      method,
      notifyChanges: notify,
    })
    expect(instance.getData()).toBe(undefined)
    expect(notify).toBeCalledTimes(0)
    instance.load().catch(undefined)
    expect(method).toBeCalledTimes(1)
    instance.cancel()
    expect(notify).toBeCalledTimes(0)
    expect(instance.getData()).toBe(undefined)
    instance.clearData()
  })

  test('should create instance without cancel', async () => {
    const notify = jest.fn()
    const method = jest.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test',
      method,
      notifyChanges: notify,
    })
    expect(notify).toBeCalledTimes(0)
    await instance.load()
    expect(method).toBeCalledTimes(1)
    expect(notify).toBeCalledTimes(1)
    expect(instance.getData()).toBe(true)
    instance.clearData()
  })

  test('should create instance with null data', async () => {
    const method = jest.fn(fakeNullPromise)
    const notifyChanges = jest.fn()
    const instance = new DataLoader({
      key: 'test',
      method,
      notifyChanges,
    })
    await instance.load()
    expect(method).toBeCalledTimes(1)
    expect(instance.getData()).toBe(null)
  })
  test('should create instance with undefined data', async () => {
    const method = jest.fn(fakeUndefinedPromise)
    const notifyChanges = jest.fn()

    const instance = new DataLoader({
      key: 'test',
      method,
      notifyChanges,
    })
    await instance.load()
    expect(method).toBeCalledTimes(1)
    expect(instance.getData()).toBe(undefined)
  })

  test('should create instance with cancel listener and error', async () => {
    const method = jest.fn(fakeErrorPromise)
    const notifyChanges = jest.fn()
    const onError = jest.fn()

    const instance = new DataLoader({
      key: 'test',
      method,
      notifyChanges,
    })
    await instance.load().catch(onError)
    expect(notifyChanges).toBeCalledTimes(1)
    expect(onError).toBeCalledTimes(1)
  })

  test.only('should launch 2 concurrent requests', async () => {
    const method = jest.fn(fakeLongSuccessPromise)
    const notifyChanges = jest.fn()
    DataLoader.maxConcurrent = 2
    for (let i = 0; i < 5; i += 1) {
      const instance = new DataLoader({
        key: `test-${i}`,
        method,
        notifyChanges,
      })
      instance.load().catch(undefined)
    }
    await waitForExpect(() => {
      expect(method).toBeCalledTimes(2)
    })
    await waitForExpect(() => {
      expect(method).toBeCalledTimes(4)
    })
    await waitForExpect(() => {
      expect(method).toBeCalledTimes(5)
    })
  })
})
