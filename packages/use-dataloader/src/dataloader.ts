// oxlint-disable eslint/max-statements
//
import { DEFAULT_MAX_CONCURRENT_REQUESTS, StatusEnum } from './constants'
import type { PromiseType } from './types'

export type DataLoaderConstructorArgs<ResultType> = {
  key: string
  method: () => PromiseType<ResultType>
  enabled?: boolean
  notifyChanges?: () => void
}

class DataLoader<ResultType, ErrorType> {
  public static maxConcurrent: number = DEFAULT_MAX_CONCURRENT_REQUESTS

  public static started = 0

  public static cachedData: Record<string, unknown | undefined> = {}

  public static queue: Record<string, PromiseType> = {}

  public key: string

  public method: () => PromiseType<ResultType>

  public isCalled = false

  public isCancelled = true

  public status: StatusEnum = StatusEnum.IDLE

  public error?: ErrorType

  public data?: ResultType

  public observers: (() => void)[] = []

  public timeout?: number

  public loadCount = 0

  public isFirstLoading = true

  public dataUpdatedAt?: number

  public constructor(args: DataLoaderConstructorArgs<ResultType>) {
    this.key = args.key
    this.method = args.method
    if (args.enabled) {
      this.status = StatusEnum.LOADING
    }
    this.data = DataLoader.cachedData[this.key] as ResultType
    if (args.notifyChanges) {
      this.observers.push(args.notifyChanges)
    }
  }

  public notifyChanges(): void {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      for (const observer of this.observers) {
        observer()
      }
    }) as unknown as number
  }

  public getData(): ResultType | undefined {
    return DataLoader.cachedData[this.key] as ResultType
  }

  private readonly tryLaunch = async (): Promise<ResultType> => {
    if (DataLoader.started < DataLoader.maxConcurrent) {
      DataLoader.started += 1
      DataLoader.queue[this.key] = this.launch()
    } else {
      DataLoader.queue[this.key] = new Promise(resolve => {
        setTimeout(resolve)
      }).then(this.tryLaunch)
    }

    return DataLoader.queue[this.key] as Promise<ResultType>
  }

  public load = async (force = false): Promise<ResultType> => {
    if (force || !this.isCalled) {
      this.isCalled = true

      if (this.status !== StatusEnum.LOADING) {
        this.status = StatusEnum.LOADING
        this.notifyChanges()
      }

      DataLoader.queue[this.key] = this.tryLaunch()
    }

    return DataLoader.queue[this.key] as Promise<ResultType>
  }

  public launch = async (): Promise<ResultType | undefined> => {
    try {
      this.isCancelled = false
      this.loadCount += 1

      const data = await this.method()

      // This can be set to false with .cancel even while the launch is pending
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!this.isCancelled) {
        DataLoader.cachedData[this.key] = data
        this.status = StatusEnum.SUCCESS
        this.data = data
        this.error = undefined
        this.dataUpdatedAt = Date.now()
      }
      this.isCalled = false
      this.isFirstLoading = false
      DataLoader.started -= 1
      delete DataLoader.queue[this.key]
      this.notifyChanges()

      return data
    } catch (error) {
      if (!this.isCancelled) {
        this.status = StatusEnum.ERROR
        this.error = error as ErrorType
      }
      this.isCalled = false
      this.isFirstLoading = false
      DataLoader.started -= 1
      delete DataLoader.queue[this.key]
      this.notifyChanges()

      if (!this.isCancelled) {
        throw error
      }

      return undefined
    }
  }

  public clearData(): void {
    DataLoader.cachedData[this.key] = undefined
  }

  public cancel(): void {
    DataLoader.started -= 1
    delete DataLoader.queue[this.key]
    this.isCancelled = true
    this.status = StatusEnum.IDLE
  }

  public addObserver(observer: () => void): void {
    this.observers.push(observer)
  }

  public removeObserver(observer: () => void): void {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }
}

export default DataLoader
