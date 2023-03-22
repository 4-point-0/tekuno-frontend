import { Badge, Box } from "@mantine/core";
import { Check, Flame } from "tabler-icons-react";

import { useNftOwned } from "@/hooks/useNftOwned";

interface OwnershipBadgeProps {
  nftId: string;
}

export const OwnershipBadge = ({ nftId }: OwnershipBadgeProps) => {
  const { isOwned, isBurned } = useNftOwned(nftId);

  if (!isOwned) {
    return null;
  }

  const Icon = isBurned ? Flame : Check;
  const color = isBurned ? "red" : "grape";

  return (
    <Badge
      size="xl"
      variant="filled"
      color={color}
      leftSection={
        <Box sx={{ lineHeight: "14px" }}>
          <Icon size={14} />
        </Box>
      }
    >
      {isBurned ? "Burned" : "Collected"}
    </Badge>
  );
};
