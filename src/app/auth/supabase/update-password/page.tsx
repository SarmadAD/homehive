import { Metadata } from "next/types";
import * as React from "react";
import { site } from "src/config";
import { AuthGuard } from "../../auth-guard";
import { UpdatePasswordForm } from "src/components/auth/supabase/update-password-form";
import { SplitLayout } from "src/components/split-layout";

export const metadata: Metadata = { title: `Update password | Supabase | Auth | ${site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <AuthGuard>
      <SplitLayout>
        <UpdatePasswordForm />
      </SplitLayout>
    </AuthGuard>
  );
}
