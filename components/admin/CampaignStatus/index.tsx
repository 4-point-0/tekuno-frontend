import { Badge, MantineColor, MantineSize } from "@mantine/core";

import { CampaignDto } from "@/services/api/admin/adminSchemas";

interface CampaignStatusProps {
  status: CampaignDto["status"];
  size?: MantineSize;
}

const COLORS: Record<CampaignDto["status"], MantineColor> = {
  Created: "green",
  Started: "violet",
  Ended: "gray",
  Paused: "pink",
};

export const CampaignStatus = ({ status, size }: CampaignStatusProps) => {
  return (
    <Badge variant="filled" color={COLORS[status]} size={size}>
      {status}
    </Badge>
  );
};
