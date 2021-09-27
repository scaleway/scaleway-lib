import { StatusEnum } from './constants'
import { OnCancelFn, OnErrorFn, OnSuccessFn, PromiseType } from './types'

export type DataLoaderConstructorArgs<T = unknown> = {
  enabled?: boolean
  key: string
  method: () => PromiseType<T>
  pollingInterval?: number
  maxDataLifetime?: number
  keepPreviousData?: boolean
  notify: (updatedRequest: DataLoader<T>) => void
}

class DataLoader<T = unknown> {
  public key: string

  public status: StatusEnum

  public pollingInterval?: number

  public maxDataLifetime?: number

  public isDataOutdated = false

  private notify: (updatedRequest: DataLoader<T>) => void

  public method: () => PromiseType<T>

  private cancelMethod?: () => void

  private canceled = false

  public keepPreviousData?: boolean

  private errorListeners: Array<OnErrorFn> = []

  private successListeners: Array<OnSuccessFn<T>> = []

  private cancelListeners: Array<OnCancelFn> = []

  public error?: Error

  private dataOutdatedTimeout?: number

  public timeout?: number

  public constructor(args: DataLoaderConstructorArgs<T>) {
    this.key = args.key
    this.status = args.enabled ? StatusEnum.LOADING : StatusEnum.IDLE
    this.method = args.method
    this.pollingInterval = args?.pollingInterval
    this.keepPreviousData = args?.keepPreviousData
    this.notify = args.notify
    this.maxDataLifetime = args.maxDataLifetime
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

  private launch = async (): Promise<void> => {
    try {
      if (this.status !== StatusEnum.LOADING) {
        this.canceled = false
        this.status = StatusEnum.LOADING
        this.notify(this)
      }
      const promise = this.method()
      this.cancelMethod = promise.cancel
      const result = await promise.then(res => res)

      this.status = StatusEnum.SUCCESS
      this.error = undefined
      this.notify(this)
      if (!this.canceled) {
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
          }, this.maxDataLifetime) as unknown as number
        }
      }
    } catch (err) {
      this.status = StatusEnum.ERROR
      this.error = err as Error
      this.notify(this)
      if (!this.canceled) {
        await Promise.all(
          this.errorListeners.map(listener => listener?.(err as Error)),
        )
      }
    }
    if (this.pollingInterval) {
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

  public destroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
}

export default DataLoader
