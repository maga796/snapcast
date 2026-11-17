import { FormatGalleryConnection } from "@/components/create/format-gallery-connection";

export default function Loading() {
  return <FormatGalleryConnection formats={[]} categories={[]} status="running" />;
}
