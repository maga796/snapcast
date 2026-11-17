"use client";

import type { FormatGalleryProps } from "@/types";
import { FormatGallery } from "./format-gallery";
import { useState } from "react";
import { CreateSetup } from "./create-setup";
import * as options from "@/lib/setup-options";

export function FormatGalleryConnection(props: Omit<FormatGalleryProps, "onSelectFormat" | "onUseOwnRecording">) {
  const [formatId, setFormatId] = useState<string | null>(null);
  const format = props.formats.find(item => item.id === formatId);
  if (format) return <CreateSetup key={format.id} format={format} {...options}
    // TODO(backend): supply real pricing, connected platforms, and operation states.
    creditsPerVideo={null} fetchStatus="idle" createStatus="idle" actionsAvailable={false}
    onBack={() => { setFormatId(null); window.scrollTo(0, 0); }}
    // TODO(backend): connect fetch, uploads, voice playback, downloads, and generation.
    onFetchLink={() => {}} onUploadFiles={() => {}} onPlayVoice={() => {}} onDownload={() => {}} onCreate={() => {}}
  />;
  return <FormatGallery {...props}
    onSelectFormat={id => { setFormatId(id); window.scrollTo(0, 0); }}
    // TODO(backend): connect the recording upload flow.
    onUseOwnRecording={() => {}}
  />;
}
