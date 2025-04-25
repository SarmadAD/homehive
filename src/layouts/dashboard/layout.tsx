import type { FC, ReactNode } from "react";

import { withAuthGuard } from "src/hocs/with-auth-guard";
import { useSettings } from "src/hooks/use-settings";

import { useSections } from "./config";
// import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";
import { layoutConfig } from "../config";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = withAuthGuard((props) => {
  const settings = useSettings();
  // const sections = useSections();

  // if (settings.settings.layout === "horizontal") {
  //   return <HorizontalLayout sections={sections} navColor={settings.settings.navColor} {...props} />;
  // }

  return <VerticalLayout>{props.children}</VerticalLayout>;
});
