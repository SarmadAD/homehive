import { useEffect, type FC, type ReactNode } from "react";

import { withAuthGuard } from "src/hocs/with-auth-guard";
import { useSettings } from "src/hooks/use-settings";

import { useSections } from "./config";
// import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";
import { layoutConfig } from "../config";
import { useSetAtom } from "jotai";
import { useUser } from "src/hooks/use-user";
import { currentUserIdAtom } from "src/state/atoms/currentUserIdAtom";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = withAuthGuard((props) => {
  // const sections = useSections();
  const settings = useSettings();
  const setCurrentUserId = useSetAtom(currentUserIdAtom);
  const { user } = useUser();

  // if (settings.settings.layout === "horizontal") {
  //   return <HorizontalLayout sections={sections} navColor={settings.settings.navColor} {...props} />;
  // }

  useEffect(() => {
    const authenticatedUserId = user?.id;
    if (authenticatedUserId) {
      setCurrentUserId(authenticatedUserId);
    }
  }, [user, setCurrentUserId]);

  return <VerticalLayout>{props.children}</VerticalLayout>;
});
