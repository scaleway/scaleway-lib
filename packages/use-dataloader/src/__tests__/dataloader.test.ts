import { describe, expect, test, vi } from 'vitest'
import waitForExpect from 'wait-for-expect'
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

const fakeLongErrorPromise = () =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('test')), 1000)
  })

describe('Dataloader class', () => {
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
    expect(method).toBeCalledTimes(1)
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

    expect(method).toBeCalledTimes(1)
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

    instance.load().catch(() => null)

    expect(method).toBeCalledTimes(1)
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
    expect(method).toBeCalledTimes(1)
    expect(notify).toBeCalledTimes(1)
    expect(instance.getData()).toBe(true)
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
    expect(method).toBeCalledTimes(1)
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
    expect(method).toBeCalledTimes(1)
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
    expect(notifyChanges).toBeCalledTimes(1)
    expect(onError).toBeCalledTimes(1)
  })

  test('should create instance with cancel', async () => {
    const method = vi.fn(fakeSuccessPromise)
    const notifyChanges = vi.fn()

    const instance = new DataLoader({
      key: 'test-cancel',
      method,
      notifyChanges,
    })

    instance.load().catch(undefined)

    instance.cancel()
    await waitForExpect(() => expect(instance.status).toBe(StatusEnum.IDLE))
    expect(notifyChanges).toBeCalledTimes(1)
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
    await waitForExpect(() => expect(instance.status).toBe(StatusEnum.IDLE))
    expect(notifyChanges).toBeCalledTimes(1)
    expect(onError).toBeCalledTimes(0)
    await waitForExpect(async () => expect(await res).toBeUndefined())
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

    for await (const instance of instances) {
      await instance.load().catch(() => null)
    }

    await waitForExpect(() => expect(method).toBeCalledTimes(5))
  })
})
