import {KarhuLogger, LogFunction} from './karhu'

let temporarilyDisabled = false

export function enableStandardOutputCapture(karhu: KarhuLogger, stdoutLogLevel: string, stderrLogLevel: string) {
  const wrappers = [
    wrap(karhu, 'stdout', stdoutLogLevel),
    wrap(karhu, 'stderr', stderrLogLevel),
  ]
  return {
    abort: () => {
      for (const wrapper of wrappers) {
        wrapper.abort()
      }
    }
  }
}

function wrap(karhu: KarhuLogger, method: 'stdout' | 'stderr', logLevel: string) {
  const original = process[method].write
  const containerAny = process[method] as any
  containerAny.write = (data: string, callback: () => void): boolean => {
    if (temporarilyDisabled) {
      return original.call(process[method], data, callback)
    }
    temporarilyDisabled = true
    const logFunction = (karhu as any)[logLevel] as LogFunction
    logFunction(data.endsWith('\n') ? data.substr(0, data.length - 1) : data)
    temporarilyDisabled = false
    callback()
    return true
  }

  return {
    abort: () => {
      process[method].write = original
    }
  }
}
