import { Group, Input, Select, Stack } from "@mantine/core";
import React from "react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";

export const PODStep = () => {
  return (
    <Stack>
      <Field label="POD name">
        <Input placeholder="Fun name for your POD" />
      </Field>

      <Group>
        <Dropzone
          title="Upload NFT Image, Video or GIF"
          description="Darg’n’ drop the NFT here. File size: 200px x 200px .png up to xy MB"
          label="Select Asset"
          dropzone={{
            onDrop: (files) => console.log("accepted files", files),
          }}
        />
      </Group>

      <Field
        label="Describe your POD"
        description="The description will be visible to users while claiming"
      >
        <Input placeholder="Minted as part of the Project Name digital collectible campaign. " />
      </Field>

      <Field
        label="How many PODs do you want to mint?"
        description="This is the suppply of NFTs available for users / customers / public to claim"
      >
        <Input placeholder="12345" />
      </Field>

      <Field
        label="Attributes"
        description="Add attributes to your POD (Optional)"
      >
        <Group>
          <Select
            placeholder="Select Attribute type"
            data={["Rarity", "Tier", "Privacy"]}
          />

          <Input placeholder="Set value" disabled />
        </Group>
      </Field>
    </Stack>
  );
};
