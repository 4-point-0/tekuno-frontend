import { Stack } from "@mantine/core";

import { NFTForm } from "../NFTForm";

export const RewardStep = () => {
  return (
    <Stack>
      <NFTForm formKey="reward" isReward />
    </Stack>
  );
};
