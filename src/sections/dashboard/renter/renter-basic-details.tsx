import { FC } from "react";
import { Avatar, Card, CardHeader, Skeleton } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { getRenterName } from "src/utils/get-renter-name";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { renterAtomWithRenterId } from "src/state/atoms/renterAtomWithRenterId";
import { useAtom } from "jotai";

export const RenterBasicDetails: FC = () => {
  const [{ isLoading: renterLoading, data: renter }] = useAtom(renterAtomWithRenterId);

  if (renterLoading) {
    return (
      <Card>
        <CardHeader
          title="Basisinformationen"
          avatar={
            <Avatar>
              <UserIcon fontSize="var(--Icon-fontSize)" />
            </Avatar>
          }
        />
        <PropertyList>
          <PropertyListItem divider label="Kontaktdaten" valueJSX={<Skeleton width="60%" />} />
          <PropertyListItem divider label="Name" valueJSX={<Skeleton width="40%" />} />
        </PropertyList>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Basisinformationen"
        avatar={
          <Avatar>
            <UserIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
      />
      <PropertyList>
        <PropertyListItem divider label="Kontaktdaten" value={renter?.email ?? ""} />
        <PropertyListItem divider label="Name" value={getRenterName(renter?.firstname ?? "", renter?.surname ?? "")} />
      </PropertyList>
    </Card>
  );
};
