import {
  ActionIcon,
  Box,
  Button,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { Calendar, Check, X } from "tabler-icons-react";
import { FileWithPath } from "@mantine/dropzone";
import { DatePicker, DateRangePicker } from "@mantine/dates";

import { CampaignDto, FileDto } from "@/services/api/admin/adminSchemas";
import {
  CAMPAIGN_DOCUMENT_TYPES,
  CAMPAIGN_IMAGE_TYPES,
  ISharedFormValues,
  IUploadedFile,
} from "../CampaignForm/FormContext";
import { Dropzone } from "@/components/form/Dropzone";
import {
  useCampaignControllerUpdate,
  useFileControllerUpdateFile,
  useFileControllerUploadFile,
} from "@/services/api/admin/adminComponents";
import { Field } from "@/components/form/Field";
import { IndigoBadge } from "@/components/core/IndigoBadge";
import { useIsMutating } from "@tanstack/react-query";
import { getImageUrl } from "@/utils/file";
import { notifications } from "@/utils/notifications";
import { useRouter } from "next/router";
import { getEditFormValidateInput } from "@/utils/validation";

interface IEditCampaign {
  campaign: CampaignDto;
}

export const EditForm: React.FC<IEditCampaign> = ({ campaign }) => {
  const form = useForm<ISharedFormValues>({
    validateInputOnChange: true,
    initialValues: {
      name: campaign.name,
      description: campaign.description || "",
      additionalDescription: campaign.additional_description || "",
      startDate: dayjs(campaign.start_date).toDate(),
      endDate: campaign.end_date ? dayjs(campaign.end_date).toDate() : null,
      documents:
        campaign.files
          ?.filter(({ tags }) => !tags.includes("image"))
          .map((response) => ({ response })) || [],
      image: {
        response: campaign.files?.find(({ tags }) => tags.includes("image")),
      },
      limitDate: Boolean(campaign.end_date),
    },
    validate: getEditFormValidateInput(),
  });

  const isMutating = useIsMutating();
  const router = useRouter();

  const uploadFile = useFileControllerUploadFile({});
  const updateFile = useFileControllerUpdateFile({});

  const updateCampaign = useCampaignControllerUpdate({
    onMutate: () => {
      notifications.create({ title: "Updating POD" });
    },
    onSuccess: () => {
      notifications.success({ title: "POD updated" });
      router.push(`/admin/previous/${router.query.id}`);
    },
    onError: () => {
      notifications.error({ title: "Errow whilw updating POD" });
    },
  });

  const { documents } = form.values;

  const handleImageDrop = async (files: Array<FileWithPath>) => {
    const file = files[0];
    const previousResponse = form.values.image?.response;

    try {
      let response: FileDto;

      if (previousResponse) {
        response = await updateFile.mutateAsync({
          pathParams: {
            id: previousResponse.id,
          },
          body: { file, tags: ["image"] },
        });
      } else {
        response = await uploadFile.mutateAsync({
          body: {
            file,
            tags: ["image"],
          },
        });
      }

      response = await uploadFile.mutateAsync({
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
      form.setFieldError("image", "Failed to upload image");
      console.error(error);
    }
  };

  const handleDocumentsDrop = async (files: Array<FileWithPath>) => {
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

  const handleDateRangeChange = ([startDate, endDate]: [
    Date | null,
    Date | null
  ]) => {
    form.setFieldValue("startDate", startDate);
    form.setFieldValue("endDate", endDate);
  };

  const handleRemove = (file: IUploadedFile) => {
    return () => {
      form.setFieldValue(
        "documents",
        documents.filter((document) => document !== file)
      );
    };
  };

  const handleSubmit = async (values: ISharedFormValues) => {
    const {
      image,
      name,
      description,
      additionalDescription,
      startDate,
      endDate,
      limitDate,
    } = values;

    const fileIds = [
      image?.response?.id,
      ...documents.map(({ response }) => response?.id),
    ].filter(Boolean) as Array<string>;

    await updateCampaign.mutateAsync({
      pathParams: {
        id: campaign.id,
      },
      body: {
        name,
        description,
        start_date: startDate?.toISOString(),
        end_date: limitDate ? endDate?.toISOString() : null,
        additional_description: additionalDescription,
        file_ids: fileIds,
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Box my="xl">
          <Dropzone
            title="Upload Image"
            description="Drag’n’ drop the campaign banner here. Max file size is 20 MB, supported formats are PNG and JPEG."
            label="Select Image"
            previewUrl={getImageUrl(form.values.image?.response)}
            error={form.getInputProps("image").error}
            isLoading={isMutating > 0}
            dropzone={{
              multiple: false,
              accept: CAMPAIGN_IMAGE_TYPES,
              onDrop: handleImageDrop,
              disabled: isMutating > 0,
            }}
          />
        </Box>

        <Group position="right">
          <Button
            type="submit"
            color="dark"
            leftIcon={<Check size={14} />}
            disabled={isMutating > 0}
          >
            Finish editing
          </Button>
        </Group>

        <Field withAsterisk label="Edit your POD name">
          <TextInput
            mt="xs"
            placeholder="Campaign name"
            {...form.getInputProps("name")}
          />
        </Field>

        <Field withAsterisk label="Edit time frame for the campaign">
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
                />
              ) : (
                <DatePicker
                  withAsterisk
                  placeholder="Select start date"
                  icon={<Calendar size={16} />}
                  {...form.getInputProps("startDate")}
                />
              )}
            </Group>
          </Stack>
        </Field>

        <Field
          label="Edit the catchy phrase for your campaign"
          description="This text will be visible on each POD page"
        >
          <Textarea
            mt="sm"
            placeholder="Placeholder text"
            {...form.getInputProps("description")}
          />
        </Field>

        <Field label="Edit the details of your campaign">
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
              isLoading={isMutating > 0}
              dropzone={{
                onDrop: handleDocumentsDrop,
                multiple: true,
                accept: CAMPAIGN_DOCUMENT_TYPES,
                disabled: isMutating > 0,
              }}
            />
            <Stack spacing="md">
              <Title order={5}>Uploaded files</Title>

              {documents.length === 0 && <Text>No files</Text>}

              <Stack spacing={8} align="flex-start">
                {documents.map((document) => (
                  <IndigoBadge
                    key={document.response?.id}
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
                    {document.response?.name}
                  </IndigoBadge>
                ))}
              </Stack>
            </Stack>
          </Group>
        </Field>
      </Stack>
    </form>
  );
};
