import { FC } from "react";
import { Avatar, Card, CardHeader, Skeleton } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { getRenterName } from "src/utils/get-renter-name";
import { useRecoilValueLoadable } from "recoil";
import { renterAtomWithRenterId } from "src/state/atoms/renterAtom";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

export const RenterBasicDetails: FC = () => {
  const renterLoadable = useRecoilValueLoadable(renterAtomWithRenterId);
  if (renterLoadable.state === "loading" || (renterLoadable.state === "hasValue" && renterLoadable.contents.id === "")) {
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

  if (renterLoadable.state === "hasError") {
    return (
      <Card>
        <CardHeader title="Basisinformationen" />
        <PropertyList>
          <PropertyListItem divider label="Fehler" value="Fehler beim Laden der Daten." />
        </PropertyList>
      </Card>
    );
  }

  const renter = renterLoadable.contents;

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
        <PropertyListItem divider label="Kontaktdaten" value={renter.email} />
        <PropertyListItem divider label="Name" value={getRenterName(renter.firstname, renter.surname)} />
      </PropertyList>
    </Card>
  );
};
