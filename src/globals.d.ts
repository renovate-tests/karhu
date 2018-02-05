declare module 'ansi-styles' {
  export interface Color {
    open: string,
    close: string
  }

  export const color: {
    purpleBright: Color,
    whiteBright: Color
    yellowBright: Color
    redBright: Color
    blueBright: Color
  }

  export const bgColor: {
    bgPurpleBright: Color,
    bgWhiteBright: Color
    bgYellowBright: Color
    bgRedBright: Color
    bgBlueBright: Color
  }
}
