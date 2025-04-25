// import type { FC, ReactNode } from "react";
// import PropTypes from "prop-types";
// import { Stack } from "@mui/material";
// import { TopNavItem } from "./top-nav-item";
// import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
// import { NavItemConfig } from "src/types/nav";

// interface Item {
//   disabled?: boolean;
//   external?: boolean;
//   icon?: ReactNode;
//   items?: Item[];
//   label?: ReactNode;
//   path?: string;
//   title: string;
// }

// interface TopNavSectionProps {
//   items?: NavItemConfig[];
//   pathname?: string | null;
//   subheader?: string;
// }

// export const TopNavSection: FC<TopNavSectionProps> = (props) => {
//   const { items = [], pathname } = props;

//   return (
//     <Stack
//       component="ul"
//       direction="row"
//       spacing={1}
//       sx={{
//         listStyle: "none",
//         m: 0,
//         p: 0,
//       }}
//     >
//       {items.map((item) => {
//         const checkPath = !!(item.href && pathname);
//         const partialMatch = checkPath ? pathname.includes(item.href!) : false;
//         const exactMatch = checkPath ? pathname === item.href : false;

//         // Branch

//         if (item.items) {
//           return (
//             <TopNavItem
//               active={partialMatch}
//               disabled={item.disabled}
//               icon={item.icon}
//               items={item.items}
//               key={item.title}
//               label={item.label}
//               title={item.title}
//             />
//           );
//         }

//         // Leaf

//         return (
//           <>
//             <RoleBasedGuard permission={item.path ?? ""}>
//               <TopNavItem
//                 active={exactMatch}
//                 disabled={item.disabled}
//                 external={item.external}
//                 icon={item.icon}
//                 key={item.title}
//                 label={item.label}
//                 path={item.path}
//                 title={item.title}
//               />
//             </RoleBasedGuard>
//           </>
//         );
//       })}
//     </Stack>
//   );
// };

// TopNavSection.propTypes = {
//   items: PropTypes.array,
//   pathname: PropTypes.string,
//   subheader: PropTypes.string,
// };
