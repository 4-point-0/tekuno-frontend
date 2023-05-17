import {
  ActionIcon,
  Box,
  Button,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Calendar, Check, X } from "tabler-icons-react";

import { IndigoBadge } from "@/components/core/IndigoBadge";
import { Dropzone } from "@/components/form/Dropzone";
import { Field } from "@/components/form/Field";
import { TextEditor } from "@/components/form/TextEditor";
import {
  useCampaignControllerCreate,
  useCampaignTypeControllerFindAll,
  useChainControllerFindAll,
  useFileControllerUpdateFile,
  useFileControllerUploadFile,
  useNftTypeControllerFindAll,
} from "@/services/api/admin/adminComponents";
import {
  CampaignDto,
  CreateNftDto,
  FileDto,
  NftTypeDto,
} from "@/services/api/admin/adminSchemas";
import { getImageUrl } from "@/utils/file";
import { notifications } from "@/utils/notifications";
import { getEditFormValidateInput } from "@/utils/validations";

import { CampaignType, campaignTypeData } from "../../../enums/CampaignType";
import {
  CAMPAIGN_DOCUMENT_TYPES,
  CAMPAIGN_IMAGE_TYPES,
  CreateFormValues,
  FormNFTValue,
  FormProvider,
  NFT_INITIAL_VALUE,
  SharedFormValues,
  UploadedFileValue,
} from "../CampaignForm/FormContext";
import { NFTForm } from "../CampaignForm/NFTForm";
import { PODStep } from "../CampaignForm/steps/PODStep";

function getCreateNftDto(
  formValue: FormNFTValue,
  nftTypeId: string
): CreateNftDto {
  return {
    properties: {
      attributes:
        formValue.attributes?.filter(({ trait_type }) => Boolean(trait_type)) ||
        [],
    },
    name: formValue?.name,
    description: formValue?.description,
    file_id: formValue?.file?.response?.id as string,
    supply: formValue?.supply,
    nft_type_id: nftTypeId,
  };
}

function getNftsFromForm(
  { poap, reward, collectibles }: CreateFormValues,
  nftTypes: NftTypeDto[]
) {
  const nfts: CreateNftDto[] = [];
  const poapTypeId = nftTypes.find((nftType) => nftType.name === "poap")?.id;
  const rewardTypeId = nftTypes.find(
    (nftType) => nftType.name === "reward"
  )?.id;
  const collectibleTypeId = nftTypes.find(
    (nftType) => nftType.name === "collectible"
  )?.id;

  if (poap && poapTypeId) {
    nfts.push(getCreateNftDto(poap as FormNFTValue, poapTypeId));
  }

  if (reward && rewardTypeId) {
    nfts.push(getCreateNftDto(reward as FormNFTValue, rewardTypeId));
  }

  if (collectibleTypeId) {
    collectibles.forEach((collectible) => {
      nfts.push(
        getCreateNftDto(collectible as FormNFTValue, collectibleTypeId)
      );
    });
  }

  return nfts;
}

interface EditFormProps {
  campaign: CampaignDto;
}

export const DuplicateForm = ({ campaign }: EditFormProps) => {
  const { nfts } = campaign;

  const nftCollectibles = nfts
    ?.filter((nft: any) => nft.nft_type.name === "collectible")
    .map((nft: any) => ({
      name: nft.name,
      description: nft.description,
      supply: nft.supply,
      attributes: nft.properties.attributes.map((attr: any) => ({
        trait_type: attr.trait_type,
        value: attr.value,
      })),
    }));

  const nftRewards = nfts
    ?.filter((nft: any) => nft.nft_type.name === "reward")
    .map((nft: any) => ({
      name: nft.name,
      description: nft.description,
      supply: nft.supply,
      attributes: nft.properties.attributes.map((attr: any) => ({
        trait_type: attr.trait_type,
        value: attr.value,
      })),
    }));

  const isMutating = useIsMutating();
  const router = useRouter();

  const uploadFile = useFileControllerUploadFile({});
  const updateFile = useFileControllerUpdateFile({});

  const { data: nftTypes } = useNftTypeControllerFindAll({});

  const { data: campaignTypes } = useCampaignTypeControllerFindAll({});
  const { data: chains } = useChainControllerFindAll({});

  const campaignType = router.query.type as CampaignType;
  const { hasRewards, hasPoap } = campaignTypeData[campaignType].form;

  const form = useForm<any>({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      description: campaign.description || "",
      additionalDescription: campaign.additional_description || "",
      startDate: dayjs(campaign.start_date).toDate(),
      endDate: campaign.end_date ? dayjs(campaign.end_date).toDate() : null,
      documents:
        campaign.files
          ?.filter(({ tags }) => !tags.includes("image"))
          .map((response) => ({ response })) || [],
      image: undefined,
      collectibles: hasRewards ? nftCollectibles : [],
      poap: hasPoap ? NFT_INITIAL_VALUE : undefined,
      reward: hasRewards ? nftRewards : undefined,
      limitDate: Boolean(campaign.end_date),
    },
    validate: getEditFormValidateInput(),
  });

  const createCampaign = useCampaignControllerCreate({
    onMutate: () => {
      notifications.create({ title: "Duplicating POD" });
    },
    onSuccess: () => {
      notifications.success({ title: "POD Duplicated" });
      router.push(`/admin/previous/${router.query.id}`);
    },
    onError: () => {
      notifications.error({ title: "Error while duplicating POD" });
    },
  });

  const { documents } = form.values;

  const handleImageDrop = async (files: FileWithPath[]) => {
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

  const handleDocumentsDrop = async (files: FileWithPath[]) => {
    const previous = documents;

    const uniqueFiles = files.filter(({ path }) => {
      return !documents.some((document: any) => document.file?.path === path);
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

    const newDocuments: UploadedFileValue[] = uniqueFiles.map((file, i) => {
      return {
        file,
        response: respones[i] as unknown as FileDto,
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

  const handleRemove = (file: UploadedFileValue) => {
    return () => {
      form.setFieldValue(
        "documents",
        documents.filter((document: any) => document !== file)
      );
    };
  };

  //createCampaign
  const handleSubmit = async (values: CreateFormValues) => {
    form.validate();

    if (!form.isValid) {
      return;
    }

    notifications.create({
      title: "Creating the campaign",
    });

    const chainId = chains?.results[0].id;
    const campaignTypeId = campaignTypes?.results.find(
      ({ name }) => name === campaignType
    )?.id;

    if (!(chainId && campaignTypeId && nftTypes?.results)) {
      return;
    }

    const {
      name,
      startDate,
      endDate,
      image,
      description,
      additionalDescription,
      documents,
      limitDate,
    } = values;

    const fileIds = [
      image?.response?.id,
      ...documents.map(({ response }) => response?.id),
    ].filter(Boolean) as string[];

    const nfts = getNftsFromForm(values, nftTypes.results);

    if (!nfts) {
      return;
    }

    try {
      await createCampaign.mutateAsync({
        body: {
          name,
          campaign_type_id: campaignTypeId,
          chain_id: chainId,
          start_date: startDate?.toISOString() as string,
          end_date: limitDate ? endDate?.toISOString() : null,
          description,
          additional_description: additionalDescription,
          nfts,
          file_ids: fileIds as string[],
        },
      });

      notifications.success({
        title: "Campaign successfully created!",
      });
    } catch (error) {
      console.error(error);
      notifications.error({
        title: "Error while creating the campaign",
      });
    }
  };

  return (
    <FormProvider form={form}>
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
              Duplicate Campaign
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

              <Group>
                <DatePickerInput
                  withAsterisk
                  placeholder="Select start date"
                  icon={<Calendar size={16} />}
                  maxDate={
                    form.values.endDate
                      ? dayjs(form.values.endDate).subtract(1, "day").toDate()
                      : undefined
                  }
                  {...form.getInputProps("startDate")}
                />
                <DatePickerInput
                  withAsterisk
                  placeholder="Select end date"
                  icon={<Calendar size={16} />}
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

          <Field
            label="Edit the catchy phrase for your campaign"
            description="This text will be visible on each POD page"
            error={form.getInputProps("description").error}
          >
            <Box my="xs">
              <TextEditor
                value={form.getInputProps("description").value}
                onChange={form.getInputProps("description").onChange}
              />
            </Box>
          </Field>

          <Field
            label="Edit the details of your campaign"
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
                  {documents.map((document: any) => (
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
          <Field label="Create your PODs" mt="xl">
            <Group mt="xl" grow align="flex-start" spacing="xl">
              <PODStep />
            </Group>
          </Field>
          {hasRewards && (
            <Field label="Create your Reward" mt="xl">
              <Group mt="xl" grow align="flex-start" spacing="xl">
                <Stack>
                  <NFTForm formKey="reward" isReward />
                </Stack>
              </Group>
            </Field>
          )}
        </Stack>
      </form>
    </FormProvider>
  );
};
