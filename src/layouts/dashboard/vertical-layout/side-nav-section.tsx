import { useMemo, type FC, type ReactNode, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import { SideNavItem } from "./side-nav-item";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";

interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

const renderItems = ({
  depth = 0,
  items,
  pathname,
}: {
  depth?: number;
  items: Item[];
  pathname?: string | null;
}): JSX.Element[] =>
  items.reduce(
    (acc: JSX.Element[], item) =>
      reduceChildRoutes({
        acc,
        depth,
        item,
        pathname,
      }),
    []
  );

const reduceChildRoutes = ({
  acc,
  depth,
  item,
  pathname,
}: {
  acc: JSX.Element[];
  depth: number;
  item: Item;
  pathname?: string | null;
}): Array<JSX.Element> => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path!) : false;
  const exactMatch = checkPath ? pathname === item.path : false;

  if (item.items) {
    acc.push(
      // <RoleBasedGuard permission={pathname ?? ""}>
      <SideNavItem
        active={partialMatch}
        depth={depth}
        disabled={item.disabled}
        icon={item.icon}
        key={item.title}
        label={item.label}
        open={partialMatch}
        title={item.title}
      >
        <Stack
          component="ul"
          spacing={0.5}
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
          }}
        >
          {renderItems({
            depth: depth + 1,
            items: item.items,
            pathname,
          })}
        </Stack>
      </SideNavItem>
      // </RoleBasedGuard>
    );
  } else {
    acc.push(
      <RoleBasedGuard permission={item.path ?? ""}>
        <SideNavItem
          active={exactMatch}
          depth={depth}
          disabled={item.disabled}
          external={item.external}
          icon={item.icon}
          key={item.title}
          label={item.label}
          path={item.path}
          title={item.title}
        />
      </RoleBasedGuard>
    );
  }

  return acc;
};

interface SideNavSectionProps {
  items?: Item[];
  pathname?: string | null;
  subheader?: string;
}

export const SideNavSection: FC<SideNavSectionProps> = (props) => {
  const { items = [], pathname, subheader = "", ...other } = props;
  const [isLoading, setIsLoading] = useState(false);

  function createRenterItems() {
    try {
      if (items.length > 0) {
        setIsLoading(true);
        const renderedItems = renderItems({ items, pathname });
        setIsLoading(false);
        return renderedItems;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return []; // Return an empty array if there's an error to avoid rendering anything
    }
  }

  const renderedItems = useMemo(() => createRenterItems(), [items, pathname]);

  return (
    <Stack
      component="ul"
      spacing={0.5}
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
      }}
      {...other}
    >
      {subheader && (
        <Box
          component="li"
          sx={{
            color: "var(--nav-section-title-color)",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.66,
            mb: 1,
            ml: 1,
            textTransform: "uppercase",
          }}
        >
          {subheader}
        </Box>
      )}
      {isLoading ? <div></div> : renderedItems}
    </Stack>
  );
};
SideNavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  subheader: PropTypes.string,
};
