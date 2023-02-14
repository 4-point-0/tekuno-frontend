import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { Badge, MantineColor } from "@mantine/core";
import React from "react";

interface ICampaignStatusProps {
  status: CampaignDto["status"];
}

const COLORS: Record<CampaignDto["status"], MantineColor> = {
  Created: "blue",
  Started: "violet",
  Ended: "gray",
  Paused: "pink",
};

export const CampaignStatus: React.FC<ICampaignStatusProps> = ({ status }) => {
  return <Badge color={COLORS[status]}>{status}</Badge>;
};
