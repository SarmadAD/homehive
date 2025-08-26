"use client";

import { Seo } from "src/components/seo";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import PricingPlans from "src/components/common/pricing/pricing-plans";

export default function Page(): React.JSX.Element {
  return (
    <>
      <Seo title="Preise" />{" "}
      <RoleBasedGuard permission="/landlordportal/dashboard/pricing">
        <PricingPlans />
      </RoleBasedGuard>
    </>
  );
}
