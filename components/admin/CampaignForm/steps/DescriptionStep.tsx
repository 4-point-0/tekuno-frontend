import { Box, Group, Stack, Text, ActionIcon, Title } from "@mantine/core";
import React from "react";
import { FileWithPath } from "@mantine/dropzone";
import { X } from "tabler-icons-react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { IndigoBadge } from "@/components/core/IndigoBadge";
import {
  useFileControllerRemove,
  useFileControllerUploadFile,
} from "@/services/api/admin/adminComponents";
import {
  CAMPAIGN_DOCUMENT_TYPES,
  IUploadedFile,
  useFormContext,
} from "../FormContext";
import { TextEditor } from "@/components/form/TextEditor";

export const DescriptionStep = () => {
  const form = useFormContext();

  const { documents } = form.values;

  const uploadFile = useFileControllerUploadFile();
  const removeFile = useFileControllerRemove();

  const handleDrop = async (files: Array<FileWithPath>) => {
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

    const newDocuments: Array<IUploadedFile> = uniqueFiles.map((file, i) => {
      return {
        file,
        response: respones[i],
      };
    });

    form.setFieldValue("documents", previous.concat(...newDocuments));
  };

  const handleRemove = (file: IUploadedFile) => {
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
        error={form.getInputProps("description").error}
      >
        <Box my="xs">
          <TextEditor
            value={form.getInputProps("description").value}
            onChange={form.getInputProps("description").onChange}
          />
        </Box>{" "}
      </Field>

      <Field
        label="Tell us the details, why would someone be part of your campaign (optional)"
        error={form.getInputProps("additionalDescription").error}
      >
        <Box my="xs">
          <TextEditor
            value={form.getInputProps("additionalDescription").value}
            onChange={form.getInputProps("additionalDescription").onChange}
          />
        </Box>
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
