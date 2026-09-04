import { describe, expect, it, vi } from 'vitest'
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
  it('should create instance then load then destroy', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const notifyChanges = vi.fn<() => void>()
    const instance = new DataLoader({
      key: 'test-destroy',
      method,
      notifyChanges,
    })
    instance.removeObserver(() => undefined)
    expect(method).toHaveBeenCalledTimes(0)
    await instance.load()
    expect(method).toHaveBeenCalledTimes(1)
    instance.clearData()
  })

  it('should create instance then load multiple times', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const notifyChanges = vi.fn<() => void>()
    const instance = new DataLoader({
      key: 'test-load',
      method,
      notifyChanges,
    })
    expect(method).toHaveBeenCalledTimes(0)

    // simulate multiple call in //
    await Promise.all([instance.load().catch(undefined), instance.load().catch(undefined), instance.load()])

    expect(method).toHaveBeenCalledTimes(1)
    instance.clearData()
  })

  it('should create instance with cancel', () => {
    const notify = vi.fn<() => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test-cancel',
      method,
      notifyChanges: notify,
    })
    expect(instance.getData()).toBeUndefined()
    expect(notify).toHaveBeenCalledTimes(0)

    // don't await as we will cancel this instance before
    instance.load().catch(() => null)

    expect(method).toHaveBeenCalledTimes(1)
    instance.cancel()
    expect(notify).toHaveBeenCalledTimes(0)

    expect(instance.getData()).toBeUndefined()
    instance.clearData()
  })

  it('should create instance without cancel', async () => {
    const notify = vi.fn<() => void>()
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const instance = new DataLoader({
      key: 'test-without-cancel',
      method,
      notifyChanges: notify,
    })
    expect(notify).toHaveBeenCalledTimes(0)
    await instance.load()
    expect(method).toHaveBeenCalledTimes(1)
    expect(notify).toHaveBeenCalledTimes(1)
    expect(instance.getData()).toBe(true)
    instance.clearData()
  })

  it('should create instance with null data', async () => {
    const method = vi.fn<typeof fakeNullPromise>(fakeNullPromise)
    const notifyChanges = vi.fn<() => void>()
    const instance = new DataLoader({
      key: 'test-null',
      method,
      notifyChanges,
    })
    await instance.load()
    expect(method).toHaveBeenCalledTimes(1)
    expect(instance.getData()).toBeNull()
  })

  it('should create instance with undefined data', async () => {
    const method = vi.fn<typeof fakeUndefinedPromise>(fakeUndefinedPromise)
    const notifyChanges = vi.fn<() => void>()

    const instance = new DataLoader({
      key: 'test-undefined',
      method,
      notifyChanges,
    })
    await instance.load()
    expect(method).toHaveBeenCalledTimes(1)
    expect(instance.getData()).toBeUndefined()
  })

  it('should create instance with error', async () => {
    const method = vi.fn<typeof fakeErrorPromise>(fakeErrorPromise)
    const notifyChanges = vi.fn<() => void>()
    const onError = vi.fn<() => void>()

    const instance = new DataLoader({
      key: 'test-error',
      method,
      notifyChanges,
    })
    await instance.load().catch(onError)
    expect(notifyChanges).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should create instance with cancel and properly set status after', async () => {
    const method = vi.fn<typeof fakeSuccessPromise>(fakeSuccessPromise)
    const notifyChanges = vi.fn<() => void>()

    const instance = new DataLoader({
      key: 'test-cancel',
      method,
      notifyChanges,
    })

    expect(notifyChanges).toHaveBeenCalledTimes(0)

    await instance.load().catch(undefined)
    expect(notifyChanges).toHaveBeenCalledTimes(1)

    instance.cancel()
    await vi.waitFor(() => {
      expect(instance.status).toBe(StatusEnum.IDLE)
      expect(notifyChanges).toHaveBeenCalledTimes(2)
    })
  })

  it('should create instance with error and cancel', async () => {
    const method = vi.fn<typeof fakeLongErrorPromise>(fakeLongErrorPromise)
    const notifyChanges = vi.fn<() => void>()
    const onError = vi.fn<() => void>()

    const instance = new DataLoader({
      key: 'test-error-cancel',
      method,
      notifyChanges,
    })
    const res = instance.load().catch(onError)
    instance.cancel()
    await vi.waitFor(() => {
      expect(instance.status).toBe(StatusEnum.IDLE)
      expect(notifyChanges).toHaveBeenCalledTimes(1)
    })
    expect(onError).toHaveBeenCalledTimes(0)
    await vi.waitFor(async () => {
      await expect(res).resolves.toBeUndefined()
    })
  })

  it('should launch multiple dataloader', async () => {
    const method = vi.fn<typeof fakeErrorPromise>(fakeErrorPromise)
    const notifyChanges = vi.fn<() => void>()

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

    await vi.waitFor(() => {
      expect(method).toHaveBeenCalledTimes(5)
    })
  })
})
