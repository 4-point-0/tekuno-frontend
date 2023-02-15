import { Group, Stack, Textarea, Text, ActionIcon, Title } from "@mantine/core";
import React from "react";
import { FileWithPath } from "@mantine/dropzone";
import { X } from "tabler-icons-react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { IndigoBadge } from "@/components/core/IndigoBadge";
import { useFileControllerUploadFile } from "@/services/api/admin/adminComponents";
import {
  CAMPAIGN_DOCUMENT_TYPES,
  IUploadedFile,
  useFormContext,
} from "../FormContext";

export const DescriptionStep = () => {
  const form = useFormContext();

  const { documents } = form.values;

  const uploadFile = useFileControllerUploadFile();

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

    const newDocuments = uniqueFiles.map((file, i) => {
      return {
        file,
        response: respones[i],
      };
    });

    form.setFieldValue("documents", previous.concat(...newDocuments));
  };

  const handleRemove = (file: IUploadedFile) => {
    return () => {
      form.setFieldValue(
        "documents",
        documents.filter((document) => document !== file)
      );
    };
  };

  return (
    <Stack>
      <Field
        label="Say a catchy phrase for your campaign"
        description="This text will be visible on each POD page"
      >
        <Textarea
          mt="sm"
          placeholder="Placeholder text"
          {...form.getInputProps("description")}
        />
      </Field>

      <Field label="Tell us the details, why would someone be part of your campaign">
        <Textarea
          mt="sm"
          placeholder="Placeholder text"
          {...form.getInputProps("additionalDescription")}
        />
      </Field>

      <Field
        sx={{ display: "none" }}
        label="Upload files related to your campaign (optional)"
      >
        <Group mt="sm" grow align="flex-start" spacing="xl">
          <Dropzone
            title="Upload Documents"
            description="Darg’n’ drop the campaign documents here. File size up to 5 MB? (Limit set by devs)"
            label="Select Document"
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
