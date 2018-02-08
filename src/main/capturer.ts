import {KarhuLogger, LogFunction} from './karhu'

let temporarilyDisabled = false

export function toggleForceCaptureDisabled(disabled: boolean) {
  temporarilyDisabled = disabled
}

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

function wrap(karhu: KarhuLogger, stream: 'stdout' | 'stderr', logLevel: string) {
  const original = process[stream].write
  const streamAsAny = process[stream] as any
  streamAsAny.write = (arg1: any, arg2: any, arg3: any): boolean => {
    const data = typeof arg1 === 'string' ? arg1 : arg1.toString('UTF-8')
    const callback = typeof arg2 === 'function' ? arg2 : arg3

    if (temporarilyDisabled || data.length === 0) {
      return original.call(process[stream], arg1, arg2, arg3)
    }
    const logFunction = (karhu as any)[logLevel] as LogFunction
    logFunction(data.endsWith && data.endsWith('\n') ? data.substr(0, data.length - 1) : data)
    if (typeof callback === 'function') {
      callback()
    }
    return true
  }

  return {
    abort: () => {
      process[stream].write = original
    }
  }
}
