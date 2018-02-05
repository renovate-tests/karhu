import {Karhu, KarhuConfig, KarhuLogger, KarhuOutputImpl, usingConfig} from '../main/karhu'
import defaultConfig from '../config/default'

class TestOutputTracker {
  public tracked: Map<string, any[][]> = new Map()
  public tracker: KarhuOutputImpl = {}

  public setup(config: KarhuConfig) {
    const trackerAsAny = this.tracker as any
    for (const logType of config.logLevels) {
      this.tracked.set(logType, [])
      trackerAsAny[logType] = (...args: any[]) => {
        trackerAsAny[logType].push(args)
      }
    }
  }
}

export function prepareTestKarhu<LoggerType = KarhuLogger>(partialConfig: Partial<KarhuConfig>) {
  return (testImpl: (karhu: Karhu<LoggerType>, output: TestOutputTracker) => (void | Promise<void>)) =>
    () => {
      const output = new TestOutputTracker()
      const config: KarhuConfig = {...defaultConfig, outputImpl: output.tracker, ...partialConfig}
      output.setup(config)
      const karhu = usingConfig<LoggerType>(config)
      return testImpl(karhu, output)
    }
}
