import { ProtectedContent } from "@/components/shell/protected-content";
import { ScreenState } from "@/components/ui/screen-state";

export default function Page() {
  // TODO(backend): supply this screen's data and status when its UI is implemented.
  return <ProtectedContent><ScreenState title="Publish" status="idle" /></ProtectedContent>;
}
