import { ProtectedContent } from "@/components/shell/protected-content";
import { CampaignsConnection } from "@/components/campaigns/campaigns-connection";

export default function Page() {
  // TODO(backend): supply account-owned campaigns, options, connections, and calendar dates.
  return <ProtectedContent><CampaignsConnection campaigns={[]} hooks={[]}
    options={{ backgrounds: [], voices: [], fonts: [] }} platforms={[]}
    month="" today="" status="idle" /></ProtectedContent>;
}
