import { describe, expect, test, vi } from 'vitest'
import waitForExpect from 'wait-for-expect'
import { StatusEnum } from '../constants'
import DataLoader from '../dataloader'

const PROMISE_TIMEOUT = 100

const fakeSuccessPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, PROMISE_TIMEOUT)
  })

const fakeNullPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, PROMISE_TIMEOUT)
  })

const fakeUndefinedPromise = async () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(undefined)
    }, PROMISE_TIMEOUT)
  })

const fakeErrorPromise = async () =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('test'))
    }, PROMISE_TIMEOUT)
  })

const fakeLongErrorPromise = async () =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('test'))
    }, 1000)
  })

describe('dataloader class', () => {
  test('should create instance then load then destroy', async () => {
    const method = vi.fn(fakeSuccessPromise)
    const notifyChanges = vi.fn()
    const instance = new DataLoader({
      key: 'test-destroy',
      method,
      notifyChanges,
    })
    instance.removeObserver(() => {})
    expect(method).toBeCalledTimes(0)
    await instance.load()
    expect(method).toHaveBeenCalledOnce()
    instance.clearData()
  })

  test('should create instance then load multiple times', async () => {
    const method = vi.fn(fakeSuccessPromise)
    const notifyChanges = vi.fn()
    const instance = new DataLoader({
      key: 'test-load',
      method,
      notifyChanges,
    })
    expect(method).toBeCalledTimes(0)

    // simulate multiple call in //
    await Promise.all([
      instance.load().catch(undefined),
      instance.load().catch(undefined),
      instance.load(),
    ])

    expect(method).toHaveBeenCalledOnce()
    instance.clearData()
  })

  test('should create instance with cancel', () => {
    const notify = vi.fn()
    const method = vi.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test-cancel',
      method,
      notifyChanges: notify,
    })
    expect(instance.getData()).toBe(undefined)
    expect(notify).toBeCalledTimes(0)

    // don't await as we will cancel this instance before
    instance.load().catch(() => null)

    expect(method).toHaveBeenCalledOnce()
    instance.cancel()
    expect(notify).toBeCalledTimes(0)

    expect(instance.getData()).toBe(undefined)
    instance.clearData()
  })

  test('should create instance without cancel', async () => {
    const notify = vi.fn()
    const method = vi.fn(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test-without-cancel',
      method,
      notifyChanges: notify,
    })
    expect(notify).toBeCalledTimes(0)
    await instance.load()
    expect(method).toHaveBeenCalledOnce()
    expect(notify).toHaveBeenCalledOnce()
    expect(instance.getData()).toBeTruthy()
    instance.clearData()
  })

  test('should create instance with null data', async () => {
    const method = vi.fn(fakeNullPromise)
    const notifyChanges = vi.fn()
    const instance = new DataLoader({
      key: 'test-null',
      method,
      notifyChanges,
    })
    await instance.load()
    expect(method).toHaveBeenCalledOnce()
    expect(instance.getData()).toBe(null)
  })
  test('should create instance with undefined data', async () => {
    const method = vi.fn(fakeUndefinedPromise)
    const notifyChanges = vi.fn()

    const instance = new DataLoader({
      key: 'test-undefined',
      method,
      notifyChanges,
    })
    await instance.load()
    expect(method).toHaveBeenCalledOnce()
    expect(instance.getData()).toBe(undefined)
  })

  test('should create instance with error', async () => {
    const method = vi.fn(fakeErrorPromise)
    const notifyChanges = vi.fn()
    const onError = vi.fn()

    const instance = new DataLoader({
      key: 'test-error',
      method,
      notifyChanges,
    })
    await instance.load().catch(onError)
    expect(notifyChanges).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledOnce()
  })

  test('should create instance with cancel', async () => {
    const method = vi.fn(fakeSuccessPromise)
    const notifyChanges = vi.fn()

    const instance = new DataLoader({
      key: 'test-cancel',
      method,
      notifyChanges,
    })

    expect(notifyChanges).toBeCalledTimes(0)

    await instance.load().catch(undefined)
    expect(notifyChanges).toHaveBeenCalledOnce()

    instance.cancel()
    await waitForExpect(() => {
      expect(instance.status).toBe(StatusEnum.IDLE)
    })
    expect(notifyChanges).toBeCalledTimes(2)
  })

  test('should create instance with error and cancel', async () => {
    const method = vi.fn(fakeLongErrorPromise)
    const notifyChanges = vi.fn()
    const onError = vi.fn()

    const instance = new DataLoader({
      key: 'test-error-cancel',
      method,
      notifyChanges,
    })
    const res = instance.load().catch(onError)
    instance.cancel()
    await waitForExpect(() => {
      expect(instance.status).toBe(StatusEnum.IDLE)
    })
    expect(notifyChanges).toHaveBeenCalledOnce()
    expect(onError).toBeCalledTimes(0)
    await waitForExpect(async () => {
      expect(await res).toBeUndefined()
    })
  })

  test('should launch multiple dataloader', async () => {
    const method = vi.fn(fakeErrorPromise)
    const notifyChanges = vi.fn()

    const instances = Array.from({ length: 5 }, (_, index) => index).map(
      index =>
        new DataLoader({
          key: `test-${index}`,
          method,
          notifyChanges,
        }),
    )

    // eslint-disable-next-line @typescript-eslint/await-thenable
    for await (const instance of instances) {
      await instance.load().catch(() => null)
    }

    await waitForExpect(() => {
      expect(method).toBeCalledTimes(5)
    })
  })
})
