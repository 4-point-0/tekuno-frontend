import { ActionIcon, Box, Group, NumberInput, TextInput } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useIsMutating } from "@tanstack/react-query";
import React from "react";
import { Trash } from "tabler-icons-react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import {
  useFileControllerRemove,
  useFileControllerUploadFile,
} from "@/services/api/admin/adminComponents";
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
  const isMutating = useIsMutating();

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
      <Field label={`${label} name`} withAsterisk>
        <TextInput
          placeholder={`Fun name for your ${label}`}
          {...form.getInputProps(`${formKey}.name`)}
        />
      </Field>

      <Group align="flex-end" noWrap>
        {!fileValue && (
          <Dropzone
            title="Upload NFT Image, Video or GIF"
            description="Drag’n’ drop the NFT here. Max file size 20 MB. Supported formats are PNG, JPEG, GIF and MP4"
            label="Select Asset"
            isLoading={uploadFile.isLoading}
            error={fileError}
            dropzone={{
              onDrop: handleDrop,
              accept: NFT_ASSET_TYPES,
              disabled: isMutating > 0,
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
        <TextInput
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
