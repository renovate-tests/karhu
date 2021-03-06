import {Karhu, KarhuConfig, KarhuLogger, KarhuTransport, usingConfig} from '../main/karhu'
import defaultConfig from '../config/default'

export class TestOutputTracker {
  public tracked: Map<string, any[][]> = new Map()
  public tracker: KarhuTransport = {
    supportsColor: () => true,
    outputImpl: {}
  }

  public setup(config: KarhuConfig) {
    for (const logType of config.logLevels) {
      this.tracked.set(logType, [])
      this.tracker.outputImpl[logType] = (toLog: any[], logLevel: string, context: string) => {
        const tracked = this.tracked.get(logType)
        if (!tracked) throw new Error('Internal error')
        tracked.push([toLog, logLevel, context])
      }
    }
  }
}

export function prepareTestKarhu<LoggerType = KarhuLogger>(partialConfig: Partial<KarhuConfig>, partialTransportConfig: Partial<KarhuTransport> = {}) {
  return (testImpl: (karhu: Karhu<LoggerType>, output: TestOutputTracker) => (void | Promise<void>)) =>
    () => {
      let index = 0
      const output = new TestOutputTracker()
      const config: KarhuConfig = {
        ...defaultConfig,
        transports: {
          test: amendTransport(output.tracker)
        },
        formatNow: () => ++index,
        ...partialConfig
      }
      output.setup(config)
      const karhu = usingConfig<LoggerType>(config)
      return testImpl(karhu, output)
    }

  function amendTransport(transport: KarhuTransport) {
    return {...transport, ...partialTransportConfig}
  }
}
