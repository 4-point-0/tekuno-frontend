import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { Badge, MantineColor, MantineSize } from "@mantine/core";
import React from "react";

interface ICampaignStatusProps {
  status: CampaignDto["status"];
  size?: MantineSize;
}

const COLORS: Record<CampaignDto["status"], MantineColor> = {
  Created: "green",
  Started: "violet",
  Ended: "gray",
  Paused: "pink",
};

export const CampaignStatus: React.FC<ICampaignStatusProps> = ({
  status,
  size,
}) => {
  return (
    <Badge variant="filled" color={COLORS[status]} size={size}>
      {status}
    </Badge>
  );
};
