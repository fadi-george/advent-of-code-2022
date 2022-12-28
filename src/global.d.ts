export {}

declare global {
  type Logger = (message?: any, ...optionalParams: any[]) => void

  namespace NodeJS {
    interface Global {
      logP1: Logger
      logP2: Logger
    }
  }

  const logP1: Logger
  const logP2: Logger
}
