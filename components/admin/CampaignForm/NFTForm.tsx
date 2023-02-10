import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { useFileControllerUploadFile } from "@/services/api/admin/adminComponents";
import { Group, Input, NumberInput, Select } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import React from "react";
import { NFT_ASSET_TYPES, useFormContext } from "./FormContext";

interface INFTFormProps {
  formKey: string;
  isReward?: boolean;
  allowAttribues?: boolean;
}

export const NFTForm: React.FC<INFTFormProps> = ({
  formKey,
  allowAttribues,
  isReward,
}) => {
  const form = useFormContext();
  const uploadFile = useFileControllerUploadFile({});

  const handleDrop = async (files: Array<FileWithPath>) => {
    const file = files[0];

    try {
      const response = await uploadFile.mutateAsync({
        body: {
          file,
        },
      });

      form.setFieldValue(`${formKey}.file`, {
        file,
        response,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const label = isReward ? "Reward" : "POD";

  return (
    <>
      <Field
        label={`${label} name`}
        withAsterisk
        error={form.getInputProps(`${formKey}.name`).error}
      >
        <Input
          placeholder={`Fun name for your ${label}`}
          {...form.getInputProps(`${formKey}.name`)}
        />
      </Field>

      <Group>
        <Dropzone
          title="Upload NFT Image, Video or GIF"
          description="Darg’n’ drop the NFT here. File size: 200px x 200px .png up to xy MB"
          label="Select Asset"
          dropzone={{
            onDrop: handleDrop,
            accept: NFT_ASSET_TYPES,
          }}
        />
      </Group>

      <Field
        label={`Describe your ${label}`}
        description="The description will be visible to users while claiming"
      >
        <Input
          placeholder={`Minted as part of the ${form.values.name} digital collectible campaign.`}
          {...form.getInputProps(`${formKey}.description`)}
        />
      </Field>

      <Field
        label={`How many ${label}s do you want to mint?`}
        description="This is the suppply of NFTs available for users / customers / public to claim"
      >
        <NumberInput
          mt="xs"
          min={1}
          styles={{
            input: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
          }}
          {...form.getInputProps(`${formKey}.supply`)}
        />
      </Field>

      {allowAttribues && (
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
      )}
    </>
  );
};
