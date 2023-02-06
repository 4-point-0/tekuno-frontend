import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { Box, Group, Input, Stack, Switch } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import React from "react";
import { Calendar } from "tabler-icons-react";

export const SetupStep = () => {
  return (
    <Stack>
      <Field
        label="Set up your POD"
        description="This is the name of the POD campaign "
      >
        <Input placeholder="Campaign name" />
      </Field>

      <Field
        label="How long does your campaign last?"
        description="Set the start date, and limit the time available to claim Attendance PODs"
      >
        <Stack mt="md" spacing={8}>
          <Switch label="Limit time" />

          <Group>
            <DatePicker
              placeholder="Select start date"
              label="Start date"
              icon={<Calendar size={16} />}
              disabled
            />
            <DatePicker
              placeholder="Select end date"
              label="End date"
              icon={<Calendar size={16} />}
              disabled
            />
          </Group>
        </Stack>
      </Field>

      <Box my="xl">
        <Dropzone
          title="Upload Image"
          description="Darg’n’ drop the campaign photo here. File size preferable between x and xy .png"
          label="Select Image"
          dropzone={{
            onDrop: (files) => console.log("accepted files", files),
          }}
        />
      </Box>
    </Stack>
  );
};
