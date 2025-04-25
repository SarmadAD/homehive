import { ColorScheme, Direction, PrimaryColor } from "src/styles/theme/types";

export type Layout = "horizontal" | "vertical";

export type NavColor = "blend_in" | "discrete" | "evident";
export type Contrast = "normal" | "high";
export type PaletteMode = "light" | "dark";

export interface Settings {
  primaryColor: PrimaryColor;
  colorScheme: ColorScheme;
  direction?: Direction;
  layout?: Layout;
  navColor?: NavColor;
  contrast?: Contrast;
  paletteMode?: PaletteMode;
  responsiveFontSizes?: boolean;
  stretch?: boolean;
}
