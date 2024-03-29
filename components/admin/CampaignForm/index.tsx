import { Button, Container, Group, Stack, Stepper } from "@mantine/core";
import { useIsMutating } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { Check, ChevronRight } from "tabler-icons-react";

import { IndigoButton } from "@/components/core/IndigoButton";
import { CampaignType, campaignTypeData } from "@/enums/CampaignType";
import {
  useCampaignControllerCreate,
  useCampaignTypeControllerFindAll,
  useChainControllerFindAll,
  useNftTypeControllerFindAll,
} from "@/services/api/admin/adminComponents";
import { CreateNftDto, NftTypeDto } from "@/services/api/admin/adminSchemas";
import { notifications } from "@/utils/notifications";
import { getCampaignFormValidateInput } from "@/utils/validations";

import {
  CreateFormValues,
  FormNFTValue,
  FormProvider,
  NFT_INITIAL_VALUE,
  useForm,
} from "./FormContext";
import { SetupStep } from "./steps/SetupStep";
import { StyledStepper } from "./StyledStepper";

const DescriptionStep = dynamic(
  import("./steps/DescriptionStep").then((m) => m.DescriptionStep)
);
const PODStep = dynamic(import("./steps/PODStep").then((m) => m.PODStep));
const RewardStep = dynamic(
  import("./steps/RewardStep").then((m) => m.RewardStep)
);

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

export const CampaignForm = () => {
  const router = useRouter();
  const [active, setActiveStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const isMutating = useIsMutating();
  const createCampaign = useCampaignControllerCreate({
    onSuccess: (campaign) => {
      router.push(`/admin/previous/${campaign.id}`);
    },
  });

  const { data: nftTypes } = useNftTypeControllerFindAll({});
  const { data: campaignTypes } = useCampaignTypeControllerFindAll({});
  const { data: chains } = useChainControllerFindAll({});

  const campaignType = router.query.type as CampaignType;

  const { hasRewards, hasPoap } = campaignTypeData[campaignType].form;

  const maxSteps = hasRewards ? 4 : 3;
  const isLastStep = active + 1 === maxSteps;

  const form = useForm({
    initialValues: {
      name: "",
      limitDate: false,
      startDate: null,
      endDate: null,
      documents: [],
      collectibles: hasRewards ? [NFT_INITIAL_VALUE] : [],
      poap: hasPoap ? NFT_INITIAL_VALUE : undefined,
      reward: hasRewards ? NFT_INITIAL_VALUE : undefined,
    },
    validate: getCampaignFormValidateInput(active, { hasPoap, hasRewards }),
  });

  const changeStep = (step: number) => {
    setActiveStep(step);
    setMaxStep((previous) => Math.max(step, previous));
  };

  const handleStepClick = (step: number) => {
    if (isMutating > 0) {
      return;
    }

    if (step < active) {
      changeStep(step);
      return;
    }

    if (step > maxStep + 1) {
      return;
    }

    form.validate();

    if (form.isValid()) {
      setActiveStep(step);
    }
  };

  const handleNextStepClick = () => {
    form.validate();

    if (form.isValid()) {
      changeStep(active + 1);
    }
  };

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
        <Container>
          <Stack>
            <StyledStepper active={active} onStepClick={handleStepClick}>
              <Stepper.Step>
                <SetupStep />
              </Stepper.Step>
              <Stepper.Step>
                <DescriptionStep />
              </Stepper.Step>
              <Stepper.Step allowStepSelect={maxStep >= 1}>
                <PODStep />
              </Stepper.Step>
              {hasRewards && (
                <Stepper.Step allowStepSelect={maxStep === 2}>
                  <RewardStep />
                </Stepper.Step>
              )}
            </StyledStepper>

            <Group position="right">
              {!isLastStep && (
                <IndigoButton
                  rightIcon={<ChevronRight size={14} />}
                  onClick={handleNextStepClick}
                  disabled={isMutating > 0}
                >
                  Next
                </IndigoButton>
              )}
              {isLastStep && (
                <Button
                  color="dark"
                  type="submit"
                  leftIcon={<Check size={14} />}
                >
                  Complete campaign
                </Button>
              )}
            </Group>
          </Stack>
        </Container>
      </form>
    </FormProvider>
  );
};
