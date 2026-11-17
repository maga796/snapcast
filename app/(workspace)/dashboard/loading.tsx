import { DashboardConnection } from "@/components/dashboard/dashboard-connection";

export default function Loading() {
  return <DashboardConnection stats={null} viewsSeries={[]} viewsByPlatform={[]} videos={[]} status="running" />;
}
