import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import {
  useFileControllerRemove,
  useFileControllerUploadFile,
} from "@/services/api/admin/adminComponents";
import {
  ActionIcon,
  Box,
  Group,
  Input,
  NumberInput,
  Select,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import React from "react";
import { Trash } from "tabler-icons-react";
import { AssetPreview } from "./AssetPreview";
import { AttributesForm } from "./AttributesForm";
import { NFT_ASSET_TYPES, useFormContext } from "./FormContext";

interface INFTFormProps {
  formKey: string;
  isReward?: boolean;
  withAttributes?: boolean;
}

export const NFTForm: React.FC<INFTFormProps> = ({
  formKey,
  withAttributes,
  isReward,
}) => {
  const form = useFormContext();
  const uploadFile = useFileControllerUploadFile({});
  const removeFile = useFileControllerRemove();

  const label = isReward ? "Reward" : "POD";

  const { error: fileError, value: fileValue } = form.getInputProps(
    `${formKey}.file`
  );

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
      form.setFieldValue(`${formKey}.file`, undefined);
      form.setFieldError(
        `${formKey}.file`,
        (error as any)?.stack?.message || "Failed to upload asset"
      );
    }
  };

  const handleFileRemove = async () => {
    await removeFile.mutateAsync({ pathParams: { id: fileValue.response.id } });
    form.setFieldValue(`${formKey}.file`, undefined);
  };

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

      <Group align="flex-end" noWrap>
        {!fileValue && (
          <Dropzone
            title="Upload NFT Image, Video or GIF"
            description="Darg’n’ drop the NFT here. File size: 200px x 200px .png up to xy MB"
            label="Select Asset"
            error={fileError}
            dropzone={{
              onDrop: handleDrop,
              accept: NFT_ASSET_TYPES,
            }}
          />
        )}

        {fileValue && (
          <>
            <Box maw={240}>
              <AssetPreview file={fileValue.response} />
            </Box>
            <ActionIcon color="red" onClick={handleFileRemove}>
              <Trash size={14}></Trash>
            </ActionIcon>
          </>
        )}
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

      {withAttributes && <AttributesForm formKey={formKey} />}
    </>
  );
};
