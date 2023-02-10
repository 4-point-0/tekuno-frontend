import { Button, Container, Group, Stack, Stepper } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Check, ChevronRight } from "tabler-icons-react";
import { useIsMutating } from "@tanstack/react-query";

import { IndigoButton } from "@/components/core/IndigoButton";
import {
  CampaignType,
  campaignTypeData,
  ICampaignFormConfig,
} from "@/enums/CampaignType";
import { DescriptionStep } from "./steps/DescriptionStep";
import {
  FormProvider,
  IFormValues,
  IUploadedFile,
  useForm,
} from "./FormContext";
import { PODStep } from "./steps/PODStep";
import { RewardStep } from "./steps/RewardStep";
import { SetupStep } from "./steps/SetupStep";
import { StyledStepper } from "./StyledStepper";
import {
  useCampaignControllerCreate,
  useCampaignTypeControllerFindAll,
  useChainControllerFindAll,
  useNftTypeControllerFindAll,
} from "@/services/api/admin/adminComponents";

const getNftValidator = (enabled: boolean) => {
  if (!enabled) {
    return {};
  }

  return {
    name: (value?: string) => (!value ? "Name is required" : null),
    file: (value?: IUploadedFile) =>
      value?.response ? null : "Asset is required",
    supply: (value?: number) =>
      !value || value <= 0 ? "Supply should be greater than 0" : null,
  };
};

function getValidateInput(
  step: number,
  { hasPoap, hasRewards }: ICampaignFormConfig
) {
  if (step === 0)
    return {
      name: (value: string) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      startDate: (value: Date | null) =>
        !value ? "Start date is required" : null,
      endDate: (value: Date | null, { limitDate }: IFormValues) => {
        return limitDate && !value
          ? "Date range must be selected if the campaing date is limited"
          : null;
      },
      image: (value?: IUploadedFile) =>
        value?.response ? null : "Image is required",
    };

  if (step === 2) {
    return {
      poap: getNftValidator(hasPoap),
      collectibles: getNftValidator(hasRewards),
    };
  }

  if (step === 3) {
    return {
      reward: getNftValidator(hasRewards),
    };
  }

  return {};
}

export const CampaignForm = () => {
  const router = useRouter();
  const [active, setActiveStep] = useState(0);
  const isMutating = useIsMutating();
  const createCampaign = useCampaignControllerCreate({});

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
      collectibles: [],
      poap: {
        name: "",
        description: "",
        supply: 1,
      },
    },
    validate: getValidateInput(active, { hasPoap, hasRewards }),
  });

  const handleStepClick = (step: number) => {
    if (isMutating > 0) {
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
      setActiveStep((current) => current + 1);
    }
  };

  const handleSubmit = async ({
    name,
    startDate,
    endDate,
    image,
    description,
    additonalDescription,
    documents,
    poap,
  }: IFormValues) => {
    form.validate();

    if (!form.isValid) {
      return;
    }

    const chainId = chains?.results[0].id;
    const campaignTypeId = campaignTypes?.results.find(
      ({ name }) => name === campaignType
    )?.id;

    if (!(chainId && campaignTypeId && nftTypes?.results)) {
      return;
    }

    const fileIds = [
      image?.response?.id,
      ...documents.map(({ response }) => response?.id),
    ];

    try {
      await createCampaign.mutate({
        body: {
          name,
          campaign_type_id: campaignTypeId,
          chain_id: chainId,
          start_date: startDate?.toISOString() as string,
          end_date: endDate?.toISOString(),
          description,
          additonal_description: additonalDescription,
          nfts: [
            {
              attributes: {},
              name: poap?.name,
              description: poap?.description,
              file_id: poap?.file?.response?.id,
              supply: poap?.supply,
              nft_type_id: nftTypes?.results.find(
                (nftType) => nftType.name === "poap"
              )?.id,
            } as any,
          ],
          file_ids: fileIds as Array<string>,
        },
      });
    } catch (error) {}
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
              <Stepper.Step>
                <PODStep hasPoap={hasPoap} />
              </Stepper.Step>
              {hasRewards && (
                <Stepper.Step>
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
