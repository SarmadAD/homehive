import { Settings } from "src/types/settings";
import { site } from "../../config";

export function applyDefaultSettings(settings: Partial<Settings>): Settings {
  return {
    colorScheme: site.colorScheme,
    primaryColor: site.primaryColor,
    direction: "ltr",
    navColor: "evident",
    layout: "vertical",
    ...settings,
  };
}
