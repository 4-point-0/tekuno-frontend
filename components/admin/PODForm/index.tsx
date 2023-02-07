import { IndigoButton } from "@/components/core/IndigoButton";
import { PODTemplate, templateData } from "@/enums/PODTempalates";
import { Button, Container, Group, Stack, Stepper } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Check, ChevronRight } from "tabler-icons-react";

import { DescriptionStep } from "./steps/DescriptionStep";
import { FormProvider, IFormValues, useForm } from "./steps/FormProvider";
import { PODStep } from "./steps/PODStep";
import { RewardStep } from "./steps/RewardStep";
import { SetupStep } from "./steps/SetupStep";
import { StyledStepper } from "./StyledStepper";

function getValidateInput(step: number) {
  if (step === 0)
    return {
      name: (value: string) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      dateRange: (value: Array<Date | null>, { limitDate }: IFormValues) => {
        return limitDate && value?.filter(Boolean).length !== 2
          ? "Date range must be selected if the campaing date is limited"
          : null;
      },
      image: (value?: FileWithPath) => (value ? null : "Image is required"),
    };

  return {};
}

export const PODForm = () => {
  const router = useRouter();
  const [active, setActiveStep] = useState(0);

  const { hasRewards } =
    templateData[router.query.template as PODTemplate].form;

  const maxSteps = hasRewards ? 4 : 3;
  const isLastStep = active + 1 === maxSteps;

  const form = useForm({
    initialValues: {
      name: "",
      limitDate: false,
      dateRange: [null, null],
    },
    validate: getValidateInput(active),
  });

  const handleStepClick = (step: number) => {
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
