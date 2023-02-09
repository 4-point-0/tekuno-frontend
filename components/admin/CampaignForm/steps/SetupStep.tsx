import React from "react";
import { Box, Group, Input, Stack, Switch } from "@mantine/core";
import { DatePicker, DateRangePicker } from "@mantine/dates";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Calendar } from "tabler-icons-react";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { useFormContext } from "../FormContext";
import { useFileControllerUploadFile } from "@/services/api/admin/adminComponents";

export const SetupStep = () => {
  const form = useFormContext();
  const uploadFile = useFileControllerUploadFile({});

  const handleDrop = async (files: Array<FileWithPath>) => {
    const file = files[0];

    try {
      const response = await uploadFile.mutateAsync({
        body: {
          file,
          tags: ["image"],
        },
      });

      form.setFieldValue("image", {
        file,
        response,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateRangeChange = ([startDate, endDate]: [
    Date | null,
    Date | null
  ]) => {
    form.setFieldValue("startDate", startDate);
    form.setFieldValue("endDate", endDate);
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
            {form.values.limitDate ? (
              <DateRangePicker
                w="100%"
                placeholder="Pick dates range"
                icon={<Calendar size={16} />}
                disabled={!form.values.limitDate}
                value={[form.values.startDate, form.values.endDate]}
                onChange={handleDateRangeChange}
                error={form.getInputProps("endDate").error}
              />
            ) : (
              <DatePicker
                placeholder="Select start date"
                icon={<Calendar size={16} />}
                {...form.getInputProps("startDate")}
              />
            )}
          </Group>
        </Stack>
      </Field>

      <Box my="xl">
        <Dropzone
          title="Upload Image"
          description="Darg’n’ drop the campaign photo here. File size preferable between x and xy .png"
          label="Select Image"
          formValue={[form.getInputProps("image").value.file]}
          error={form.getInputProps("image").error}
          dropzone={{
            multiple: false,
            accept: IMAGE_MIME_TYPE,
            onDrop: handleDrop,
            disabled: uploadFile.isLoading,
          }}
        />
      </Box>
    </Stack>
  );
};
