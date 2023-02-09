import { Button, Container, Group, Stack, Stepper } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Check, ChevronRight } from "tabler-icons-react";

import { IndigoButton } from "@/components/core/IndigoButton";
import { CampaignType, campaignTypeData } from "@/enums/CampaignType";

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
import { useIsMutating } from "@tanstack/react-query";

function getValidateInput(step: number) {
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

  return {};
}

export const CampaignForm = () => {
  const router = useRouter();
  const [active, setActiveStep] = useState(0);

  const isMutating = useIsMutating();

  const { hasRewards } =
    campaignTypeData[router.query.type as CampaignType].form;

  const maxSteps = hasRewards ? 4 : 3;
  const isLastStep = active + 1 === maxSteps;

  const form = useForm({
    initialValues: {
      name: "",
      limitDate: false,
      startDate: null,
      endDate: null,
      documents: [],
    },
    validate: getValidateInput(active),
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

  return (
    <FormProvider form={form}>
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
              <PODStep />
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
              <Button color="dark" leftIcon={<Check size={14} />}>
                Complete campaign
              </Button>
            )}
          </Group>
        </Stack>
      </Container>
    </FormProvider>
  );
};
