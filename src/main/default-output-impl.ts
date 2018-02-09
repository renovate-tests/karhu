export default {
  ERROR: (toLog: any[]) => console.error(toLog), /* tslint:disable-line:no-console */
  WARN: (toLog: any[]) => console.warn(toLog), /* tslint:disable-line:no-console */
  default: (toLog: any[]) => console.log(toLog) /* tslint:disable-line:no-console */
}
