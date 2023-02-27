import React from "react";
import { Box, Group, Stack, Switch, TextInput } from "@mantine/core";
import { DatePicker, DateRangePicker, DayModifiers } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import { Calendar } from "tabler-icons-react";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { CAMPAIGN_IMAGE_TYPES, useFormContext } from "../FormContext";
import {
  useFileControllerRemove,
  useFileControllerUploadFile,
} from "@/services/api/admin/adminComponents";
import { getImageUrl } from "@/utils/file";
import { useDayStyle } from "@/utils/date";

export const SetupStep = () => {
  const form = useFormContext();
  const isMutating = useIsMutating();
  const uploadFile = useFileControllerUploadFile({});
  const removeFile = useFileControllerRemove({});
  const dayStyle = useDayStyle();

  const handleDrop = async (files: Array<FileWithPath>) => {
    const file = files[0];

    const { image } = form.values;

    try {
      if (image?.response) {
        await removeFile.mutateAsync({ pathParams: { id: image.response.id } });
      }

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
      form.setFieldValue("image", undefined);

      form.setFieldError(
        "image",
        (error as any)?.stack?.message || "Failed to upload image"
      );

      console.error(error);
    }
  };

  return (
    <Stack>
      <Box my="xl">
        <Dropzone
          title="Upload Image"
          description="Drag’n’ drop the campaign banner here. Max file size is 20 MB, supported formats are PNG and JPEG."
          label="Select Image"
          previewUrl={getImageUrl(form.values.image?.response)}
          error={form.getInputProps("image").error}
          isLoading={uploadFile.isLoading}
          dropzone={{
            multiple: false,
            accept: CAMPAIGN_IMAGE_TYPES,
            onDrop: handleDrop,
            disabled: isMutating > 0,
          }}
        />
      </Box>

      <Field
        withAsterisk
        label="Set up your POD"
        description="This is the name of the POD campaign "
      >
        <TextInput
          placeholder="Campaign name"
          {...form.getInputProps("name")}
        />
      </Field>

      <Field
        withAsterisk
        label="How long does your campaign last?"
        description="Set the start date, and limit the time available to claim Attendance PODs"
      >
        <Stack mt="md" spacing={8}>
          <Switch
            label="Limit time"
            checked={form.getInputProps("limitDate").value}
            onClick={form.getInputProps("limitDate").onChange}
          />

          <Group>
            <DatePicker
              withAsterisk
              placeholder="Select start date"
              icon={<Calendar size={16} />}
              dayStyle={dayStyle}
              maxDate={
                form.values.endDate
                  ? dayjs(form.values.endDate).subtract(1, "day").toDate()
                  : undefined
              }
              {...form.getInputProps("startDate")}
            />
            <DatePicker
              withAsterisk
              placeholder="Select end date"
              icon={<Calendar size={16} />}
              dayStyle={dayStyle}
              disabled={!form.values.limitDate}
              minDate={
                form.values.startDate
                  ? dayjs(form.values.startDate).add(1, "day").toDate()
                  : undefined
              }
              {...form.getInputProps("endDate")}
            />
          </Group>
        </Stack>
      </Field>
    </Stack>
  );
};
