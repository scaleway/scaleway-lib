import { DEFAULT_MAX_CONCURRENT_REQUESTS, StatusEnum } from './constants'
import { OnCancelFn, OnErrorFn, OnSuccessFn, PromiseType } from './types'

export type DataLoaderConstructorArgs<T = unknown> = {
  enabled?: boolean
  key: string
  method: () => PromiseType<T>
  pollingInterval?: number
  maxDataLifetime?: number
  keepPreviousData?: boolean
}

class DataLoader<T = unknown> {
  public static started = 0

  public static maxConcurrent = DEFAULT_MAX_CONCURRENT_REQUESTS

  public static cachedData = {} as Record<string, unknown | undefined>

  public key: string

  public status: StatusEnum

  public pollingInterval?: number

  public maxDataLifetime?: number

  public isDataOutdated = false

  public method: () => PromiseType<T>

  private cancelMethod?: () => void

  private canceled = false

  public keepPreviousData?: boolean

  private errorListeners: Array<OnErrorFn> = []

  private successListeners: Array<OnSuccessFn<T>> = []

  private cancelListeners: Array<OnCancelFn> = []

  private observerListeners: Array<(dataloader: DataLoader<T>) => void> = []

  public error?: Error

  private dataOutdatedTimeout?: number

  public timeout?: number

  private destroyed = false

  public constructor(args: DataLoaderConstructorArgs<T>) {
    this.key = args.key
    this.status = args.enabled ? StatusEnum.LOADING : StatusEnum.IDLE
    this.method = args.method
    this.pollingInterval = args?.pollingInterval
    this.keepPreviousData = args?.keepPreviousData
    this.maxDataLifetime = args.maxDataLifetime
    if (args.enabled) {
      const tryLaunch = () => {
        if (DataLoader.started < DataLoader.maxConcurrent) {
          // Because we want to launch the request directly without waiting the return
          // eslint-disable-next-line no-void
          void this.load()
        } else {
          setTimeout(tryLaunch)
        }
      }
      tryLaunch()
    } else {
      this.notifyChanges()
    }
  }

  public getData(): T | undefined {
    return (DataLoader.cachedData[this.key] as T) ?? undefined
  }

  private notifyChanges(): void {
    this.observerListeners.forEach(observerListener => observerListener(this))
  }

  public load = async (force = false): Promise<void> => {
    if (
      force ||
      this.status !== StatusEnum.SUCCESS ||
      (this.status === StatusEnum.SUCCESS && this.isDataOutdated)
    ) {
      if (this.timeout) {
        // Prevent multiple call at the same time
        clearTimeout(this.timeout)
      }
      await this.launch()
    }
  }

  public launch = async (): Promise<void> => {
    try {
      if (this.status !== StatusEnum.LOADING) {
        this.canceled = false
        this.status = StatusEnum.LOADING
        this.notifyChanges()
      }
      DataLoader.started += 1
      const promise = this.method()
      this.cancelMethod = promise.cancel
      const result = await promise.then(res => res)

      this.status = StatusEnum.SUCCESS
      this.error = undefined
      if (!this.canceled) {
        DataLoader.cachedData[this.key] = result

        await Promise.all(
          this.successListeners.map(listener => listener?.(result)),
        )

        this.isDataOutdated = false
        if (this.dataOutdatedTimeout) {
          clearTimeout(this.dataOutdatedTimeout)
          this.dataOutdatedTimeout = undefined
        }

        if (this.maxDataLifetime) {
          this.dataOutdatedTimeout = setTimeout(() => {
            this.isDataOutdated = true
            this.notifyChanges()
          }, this.maxDataLifetime) as unknown as number
        }
      }
      this.notifyChanges()
    } catch (err) {
      this.status = StatusEnum.ERROR
      this.error = err as Error
      this.notifyChanges()
      if (!this.canceled) {
        await Promise.all(
          this.errorListeners.map(listener => listener?.(err as Error)),
        )
      }
    }
    DataLoader.started -= 1
    if (this.pollingInterval && !this.destroyed) {
      this.timeout = setTimeout(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.launch,
        this.pollingInterval,
      ) as unknown as number
    }
  }

  public cancel = async (): Promise<void> => {
    this.canceled = true
    this.cancelMethod?.()
    await Promise.all(this.cancelListeners.map(listener => listener?.()))
  }

  public addOnSuccessListener(fn: OnSuccessFn<T>): void {
    if (!this.successListeners.includes(fn)) {
      this.successListeners.push(fn)
    }
  }

  public addOnErrorListener(fn: OnErrorFn): void {
    if (!this.errorListeners.includes(fn)) {
      this.errorListeners.push(fn)
    }
  }

  public addOnCancelListener(fn: OnCancelFn): void {
    if (!this.cancelListeners.includes(fn)) {
      this.cancelListeners.push(fn)
    }
  }

  public removeOnSuccessListener(fn: OnSuccessFn<T>): void {
    const index = this.successListeners.indexOf(fn)
    if (index > -1) {
      this.successListeners.splice(index, 1)
    }
  }

  public removeOnErrorListener(fn: OnErrorFn): void {
    const index = this.errorListeners.indexOf(fn)
    if (index > -1) {
      this.errorListeners.splice(index, 1)
    }
  }

  public removeOnCancelListener(fn: OnCancelFn): void {
    const index = this.cancelListeners.indexOf(fn)
    if (index > -1) {
      this.cancelListeners.splice(index, 1)
    }
  }

  public addObserver(fn: (args: DataLoader<T>) => void): void {
    this.observerListeners.push(fn)
  }

  public removeObserver(fn: (args: DataLoader<T>) => void): void {
    const index = this.observerListeners.indexOf(fn)
    if (index > -1) {
      this.observerListeners.splice(index, 1)
    }
  }

  public clearData(): void {
    DataLoader.cachedData[this.key] = undefined
    this.notifyChanges()
  }

  public destroy(): void {
    this.cancel?.()
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.destroyed = true
  }

  public getObserversCount(): number {
    return this.observerListeners.length
  }
}

export default DataLoader
