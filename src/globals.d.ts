declare module 'ansi-styles' {
  export interface Color {
    open: string,
    close: string
  }

  export const color: {
    magentaBright: Color,
    whiteBright: Color
    yellowBright: Color
    redBright: Color
    blueBright: Color
  }

  export const bgColor: {
    bgMagentaBright: Color,
    bgWhiteBright: Color
    bgYellowBright: Color
    bgRedBright: Color
    bgBlueBright: Color
  }
}
