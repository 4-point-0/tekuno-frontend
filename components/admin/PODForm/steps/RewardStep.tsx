import { Group, Input, Stack } from "@mantine/core";
import React from "react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";

export const RewardStep = () => {
  return (
    <Stack>
      <Field label="Reward name">
        <Input placeholder="Fun name for your Reward" />
      </Field>

      <Group>
        <Dropzone
          title="Upload Reward Image, Video or GIF"
          description="Darg’n’ drop the NFT here. File size: 200px x 200px .png up to xy MB"
          label="Select Asset"
          dropzone={{
            onDrop: (files) => console.log("accepted files", files),
          }}
        />
      </Group>

      <Field
        label="Describe your Reward"
        description="The description will be visible to users while claiming"
      >
        <Input placeholder="You will get a nice Project name swag" />
      </Field>

      <Field
        label="How many Rewards do you want to mint?"
        description="This is the suppply of Rewards available for users / customers / public to claim."
      >
        <Input placeholder="12345" />
      </Field>
    </Stack>
  );
};
