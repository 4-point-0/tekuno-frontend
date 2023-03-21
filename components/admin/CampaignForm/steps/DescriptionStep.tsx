import { ActionIcon, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { X } from "tabler-icons-react";

import { IndigoBadge } from "@/components/core/IndigoBadge";
import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import {
  useFileControllerRemove,
  useFileControllerUploadFile,
} from "@/services/api/admin/adminComponents";

import {
  CAMPAIGN_DOCUMENT_TYPES,
  UploadedFileValue,
  useFormContext,
} from "../FormContext";

export const DescriptionStep = () => {
  const form = useFormContext();

  const { documents } = form.values;

  const uploadFile = useFileControllerUploadFile();
  const removeFile = useFileControllerRemove();

  const handleDrop = async (files: FileWithPath[]) => {
    const previous = documents;

    const uniqueFiles = files.filter(({ path }) => {
      return !documents.some((document) => document.file?.path === path);
    });

    const respones = await Promise.all(
      uniqueFiles.map((file) => {
        return uploadFile.mutateAsync({
          body: {
            file,
            tags: ["document"],
          },
        });
      })
    );

    const newDocuments: UploadedFileValue[] = uniqueFiles.map((file, i) => {
      return {
        file,
        response: respones[i],
      };
    });

    form.setFieldValue("documents", previous.concat(...newDocuments));
  };

  const handleRemove = (file: UploadedFileValue) => {
    return async () => {
      try {
        await removeFile.mutateAsync({
          pathParams: { id: file.response?.id as string },
        });

        form.setFieldValue(
          "documents",
          documents.filter((document) => document !== file)
        );
      } catch (error) {
        console.error(error);
      }
    };
  };

  return (
    <Stack>
      <Field
        withAsterisk
        label="Say a catchy phrase for your campaign"
        description="This text will be visible on each POD page"
      >
        <Textarea
          mt="sm"
          placeholder="Placeholder text"
          {...form.getInputProps("description")}
        />
      </Field>

      <Field label="Tell us the details, why would someone be part of your campaign (optional)">
        <Textarea
          mt="sm"
          placeholder="Placeholder text"
          {...form.getInputProps("additionalDescription")}
        />
      </Field>

      <Field label="Upload files related to your campaign (optional)">
        <Group mt="sm" grow align="flex-start" spacing="xl">
          <Dropzone
            title="Upload Documents"
            description="Drag’n’ drop the campaign PDF documents here. Max file size is 20 MB."
            label="Select Document"
            isLoading={uploadFile.isLoading}
            dropzone={{
              onDrop: handleDrop,
              multiple: true,
              accept: CAMPAIGN_DOCUMENT_TYPES,
              disabled: uploadFile.isLoading,
            }}
          />
          <Stack spacing="md">
            <Title order={5}>Uploaded files</Title>

            {documents.length === 0 && <Text>No files</Text>}

            <Stack spacing={8} align="flex-start">
              {documents.map((document) => (
                <IndigoBadge
                  key={document.file?.path}
                  leftSection={
                    <ActionIcon
                      variant="transparent"
                      color="dark"
                      onClick={handleRemove(document)}
                    >
                      <X size={14} />
                    </ActionIcon>
                  }
                  size="lg"
                >
                  {document.file?.name}
                </IndigoBadge>
              ))}
            </Stack>
          </Stack>
        </Group>
      </Field>
    </Stack>
  );
};
