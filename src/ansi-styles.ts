export interface Color {
  open: string,
  close: string
}

export interface FgColor {
  magentaBright: Color,
  whiteBright: Color
  yellowBright: Color
  redBright: Color
  blueBright: Color
}

export interface BgColor {
  bgMagentaBright: Color,
  bgWhiteBright: Color
  bgYellowBright: Color
  bgRedBright: Color
  bgBlueBright: Color
}

export interface AnsiStyles {
  color: FgColor
  bgColor: BgColor
}
