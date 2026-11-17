import { DashboardConnection } from "@/components/dashboard/dashboard-connection";
import { ProtectedContent } from "@/components/shell/protected-content";

export default function DashboardPage() {
  return <ProtectedContent><DashboardConnection
    // TODO(backend): supply dashboard data and operation status.
    stats={null} viewsSeries={[]} viewsByPlatform={[]} videos={[]} status="idle"
  /></ProtectedContent>;
}
