import * as React from "react";
import { Html, Button } from "@react-email/components";
import { Link } from "@react-email/components";
import { Renter } from "@prisma/client";

interface Props {
  renter: Renter;
}

export function InviteEmail({ renter }: Props) {
  const buildRegisterLink =
    process.env.NODE_ENV === "production"
      ? `https://homehive.me/auth/firebase/register/invite/:renterId?renterId=${renter.id}`
      : `http://localhost:3000/auth/firebase/register/invite/:renterId?renterId=${renter.id}`;
  return (
    <Html lang="en">
      <Link href={buildRegisterLink}>Link zum Mieter-Portal</Link>
    </Html>
  );
}

export default InviteEmail;
