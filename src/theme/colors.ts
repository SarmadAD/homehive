import { alpha } from "@mui/system/colorManipulator";
import type { ColorRange, PaletteColor } from "@mui/material/styles/createPalette";

const withAlphas = (color: PaletteColor): PaletteColor => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

export const neutral: ColorRange = {
  50: "#F8F9FA",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D2D6DB",
  400: "#9DA4AE",
  500: "#6C737F",
  600: "#4D5761",
  700: "#2F3746",
  800: "#1C2536",
  900: "#111927",
};

export const blue = withAlphas({
  lightest: "#F5F8FF",
  light: "#EBEFFF",
  main: "#2970FF",
  dark: "#004EEB",
  darkest: "#00359E",
  contrastText: "#FFFFFF",
  activated: "#1A5DFF",
  hovered: "#3A7DFF",
  selected: "#0050D4",
});

export const green = withAlphas({
  lightest: "#F6FEF9",
  light: "#EDFCF2",
  main: "#16B364",
  dark: "#087443",
  darkest: "#084C2E",
  contrastText: "#FFFFFF",
  activated: "#13A354",
  hovered: "#18C374",
  selected: "#0A8F44",
});

export const indigo = withAlphas({
  lightest: "#F5F7FF",
  light: "#EBEEFE",
  main: "#6366F1",
  dark: "#4338CA",
  darkest: "#312E81",
  contrastText: "#FFFFFF",
  activated: "#5258E1",
  hovered: "#7479F3",
  selected: "#3A4ABF",
});

export const purple = withAlphas({
  lightest: "#F9F5FF",
  light: "#F4EBFF",
  main: "#9E77ED",
  dark: "#6941C6",
  darkest: "#42307D",
  contrastText: "#FFFFFF",
  activated: "#8D66DD",
  hovered: "#A47EF3",
  selected: "#5F3FBF",
});

export const success = withAlphas({
  lightest: "#F0FDF9",
  light: "#3FC79A",
  main: "#10B981",
  dark: "#0B815A",
  darkest: "#134E48",
  contrastText: "#FFFFFF",
  activated: "#0FA971",
  hovered: "#4FD7A1",
  selected: "#0A6F4A",
});

export const info = withAlphas({
  lightest: "#ECFDFF",
  light: "#CFF9FE",
  main: "#06AED4",
  dark: "#0E7090",
  darkest: "#164C63",
  contrastText: "#FFFFFF",
  activated: "#059EC4",
  hovered: "#37C8E4",
  selected: "#0B5F80",
});

export const warning = withAlphas({
  lightest: "#FFFAEB",
  light: "#FEF0C7",
  main: "#F79009",
  dark: "#B54708",
  darkest: "#7A2E0E",
  contrastText: "#FFFFFF",
  activated: "#E68008",
  hovered: "#F9A32A",
  selected: "#A63E07",
});

export const error = withAlphas({
  lightest: "#FEF3F2",
  light: "#FEE4E2",
  main: "#F04438",
  dark: "#B42318",
  darkest: "#7A271A",
  contrastText: "#FFFFFF",
  activated: "#E03C30",
  hovered: "#F25A4A",
  selected: "#9A1F14",
});
