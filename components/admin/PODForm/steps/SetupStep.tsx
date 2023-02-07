import React from "react";
import dayjs from "dayjs";
import { Box, Group, Input, Stack, Switch } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Calendar } from "tabler-icons-react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { useFormContext } from "./FormProvider";

export const SetupStep = () => {
  const form = useFormContext();

  const handleDrop = (files: Array<FileWithPath>) => {
    form.setValues((values) => ({
      ...values,
      image: files[0],
    }));
  };

  return (
    <Stack>
      <Field
        label="Set up your POD"
        description="This is the name of the POD campaign "
        error={form.getInputProps("name").error}
      >
        <Input placeholder="Campaign name" {...form.getInputProps("name")} />
      </Field>

      <Field
        label="How long does your campaign last?"
        description="Set the start date, and limit the time available to claim Attendance PODs"
      >
        <Stack mt="md" spacing={8}>
          <Switch
            label="Limit time"
            checked={form.getInputProps("limitDate").value}
            onClick={form.getInputProps("limitDate").onChange}
          />

          <Group miw="40%" maw={300}>
            <DateRangePicker
              w="100%"
              placeholder="Pick dates range"
              minDate={dayjs(new Date()).startOf("day").toDate()}
              icon={<Calendar size={16} />}
              disabled={!form.values.limitDate}
              {...form.getInputProps("dateRange")}
            />
          </Group>
        </Stack>
      </Field>

      <Box my="xl">
        <Dropzone
          title="Upload Image"
          description="Darg’n’ drop the campaign photo here. File size preferable between x and xy .png"
          label="Select Image"
          formValue={[form.getInputProps("image").value]}
          error={form.getInputProps("image").error}
          dropzone={{
            multiple: false,
            accept: IMAGE_MIME_TYPE,
            onDrop: handleDrop,
          }}
        />
      </Box>
    </Stack>
  );
};
