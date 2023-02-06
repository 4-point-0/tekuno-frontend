import { Group, Stack, Textarea } from "@mantine/core";
import React from "react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";

export const DescriptionStep = () => {
  return (
    <Stack>
      <Field
        label="Say a catchy phrase for your campaign"
        description="This text will be visible on each POD page"
      >
        <Textarea mt="sm" placeholder="Placeholder text" />
      </Field>

      <Field label="Tell us the details, why would someone be part of your campaign">
        <Textarea mt="sm" placeholder="Placeholder text" />
      </Field>

      <Group>
        <Dropzone
          title="Upload Documents"
          description="Darg’n’ drop the campaign documents here. File size up to 5 MB? (Limit set by devs)"
          label="Select Document"
          dropzone={{
            onDrop: (files) => console.log("accepted files", files),
          }}
        />
      </Group>
    </Stack>
  );
};
