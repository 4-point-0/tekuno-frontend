import { Button, Container, Group, Stack, Stepper } from "@mantine/core";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

import { DescriptionStep } from "./steps/DescriptionStep";
import { PDOStep } from "./steps/PDOStep";
import { RewardStep } from "./steps/RewardStep";
import { SetupStep } from "./steps/SetupStep";
import { StyledStepper } from "./StyledStepper";

export const CDOForm = () => {
  const [active, setActive] = useState(0);

  return (
    <Container size="xl">
      <Stack>
        <StyledStepper active={active} onStepClick={setActive}>
          <Stepper.Step>
            <SetupStep />
          </Stepper.Step>
          <Stepper.Step>
            <DescriptionStep />
          </Stepper.Step>
          <Stepper.Step>
            <PDOStep />
          </Stepper.Step>
          <Stepper.Step>
            <RewardStep />
          </Stepper.Step>
        </StyledStepper>

        <Group position="right">
          <Button rightIcon={<ChevronRight size={14} />}>Next</Button>
        </Group>
      </Stack>
    </Container>
  );
};
