import { ProtectedContent } from "@/components/shell/protected-content";
import { FormatGalleryConnection } from "@/components/create/format-gallery-connection";
import { formatCatalog, formatCategories } from "@/lib/format-catalog";

export default function Page() {
  // TODO(backend): replace the approved static catalog with records and video previews.
  return <ProtectedContent><FormatGalleryConnection formats={formatCatalog} categories={formatCategories} status="idle" /></ProtectedContent>;
}
