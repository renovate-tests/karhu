declare module 'ansi-styles' {
  export interface Color {
    open: string,
    close: string
  }

  export interface Colors {
    purpleBright: Color,
    whiteBright: Color
    yellowBright: Color
    redBright: Color
    blueBright: Color
  }

  interface Styles {
    color: Colors
    bgColor: Colors
  }
  export const color: Colors
  export const bgColor: Colors
}
