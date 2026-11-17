"use client";

import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import type { CampaignsData } from "@/types";
import { Campaigns } from "./campaigns";

export function CampaignsConnection(props: CampaignsData): ReactElement {
  const router = useRouter();
  // TODO(backend): connect mutations and supply real operation statuses.
  return <Campaigns campaigns={props.campaigns} hooks={props.hooks} options={props.options}
    platforms={props.platforms} month={props.month} today={props.today}
    status={props.status} message={props.message} actionsAvailable={false}
    onChange={() => {}} onApprove={() => {}} onRequestClientApproval={() => {}}
    onTogglePause={() => {}} onRegenerateScript={() => {}} onToggleSkipDate={() => {}}
    onConnectPlatform={() => {}} onNewCampaign={() => router.push("/create")} />;
}
