import React from "react";
import {
  Box,
  Group,
  Stack,
  Switch,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker, DateRangePicker, DayModifiers } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import { Calendar } from "tabler-icons-react";
import { useIsMutating } from "@tanstack/react-query";

import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { CAMPAIGN_IMAGE_TYPES, useFormContext } from "../FormContext";
import {
  useFileControllerRemove,
  useFileControllerUploadFile,
} from "@/services/api/admin/adminComponents";
import { getImageUrl } from "@/utils/file";
import dayjs from "dayjs";

export const SetupStep = () => {
  const form = useFormContext();
  const theme = useMantineTheme();

  const isMutating = useIsMutating();

  const uploadFile = useFileControllerUploadFile({});
  const removeFile = useFileControllerRemove({});

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

  const handleDateRangeChange = ([startDate, endDate]: [
    Date | null,
    Date | null
  ]) => {
    form.setFieldValue("startDate", startDate);
    form.setFieldValue("endDate", endDate);
  };

  const dayStyle = (date: Date, modifier: DayModifiers) =>
    dayjs(date).startOf("day").toISOString() ===
    dayjs(new Date()).startOf("day").toISOString()
      ? {
          backgroundColor:
            theme.colors.blue[modifier.inRange || modifier.selected ? 6 : 0],
        }
      : {};

  return (
    <Stack>
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

          <Group miw="40%" maw={300}>
            {form.values.limitDate ? (
              <DateRangePicker
                w="100%"
                withAsterisk
                placeholder="Pick dates range"
                icon={<Calendar size={16} />}
                disabled={!form.values.limitDate}
                value={[form.values.startDate, form.values.endDate]}
                onChange={handleDateRangeChange}
                error={form.getInputProps("endDate").error}
                dayStyle={dayStyle}
              />
            ) : (
              <DatePicker
                withAsterisk
                placeholder="Select start date"
                icon={<Calendar size={16} />}
                dayStyle={dayStyle}
                {...form.getInputProps("startDate")}
              />
            )}
          </Group>
        </Stack>
      </Field>

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
    </Stack>
  );
};
