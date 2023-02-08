import {
  Box,
  Group,
  Stack,
  Textarea,
  Text,
  Badge,
  ActionIcon,
  Title,
} from "@mantine/core";
import React, { useState } from "react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { FileWithPath } from "@mantine/dropzone";
import { X } from "tabler-icons-react";
import { useFormContext } from "./FormProvider";

export const DescriptionStep = () => {
  const form = useFormContext();
  const [documents, setDocuments] = useState<Array<FileWithPath>>(
    () => form.values.documents
  );

  const handleDrop = (files: Array<FileWithPath>) => {
    setDocuments((previous) => {
      const uniqueFiles = files.filter(({ path }) => {
        return !documents.some((document) => document.path === path);
      });

      const newDocuments = [...previous, ...uniqueFiles];

      form.setFieldValue("documents", newDocuments);

      return newDocuments;
    });
  };

  const handleRemove = (file: FileWithPath) => {
    return () => setDocuments((previous) => previous.filter((f) => f !== file));
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
          {...form.getInputProps("additonalDescription")}
        />
      </Field>

      <Field label="Upload files related to your campaign (optional)">
        <Group mt="sm" grow align="flex-start" spacing="xl">
          <Dropzone
            title="Upload Documents"
            description="Darg’n’ drop the campaign documents here. File size up to 5 MB? (Limit set by devs)"
            label="Select Document"
            dropzone={{
              onDrop: handleDrop,
              multiple: true,
            }}
          />
          <Stack spacing="md">
            <Title order={5}>Uploaded files</Title>

            {documents.length === 0 && <Text>No files</Text>}

            <Stack spacing={8} align="flex-start">
              {documents.map((file) => (
                <Badge
                  key={file.path}
                  color="indigo"
                  leftSection={
                    <ActionIcon
                      color="indigo"
                      sx={{ color: "#000" }}
                      onClick={handleRemove(file)}
                    >
                      <X size={14} />
                    </ActionIcon>
                  }
                  size="lg"
                  styles={{
                    root: {
                      paddingLeft: 4,
                      color: "black",
                      textTransform: "none",
                      fontWeight: 600,
                    },
                  }}
                >
                  {file.name}
                </Badge>
              ))}
            </Stack>
          </Stack>
        </Group>
      </Field>
    </Stack>
  );
};
