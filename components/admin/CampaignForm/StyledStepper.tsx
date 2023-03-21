import { Stepper, StepperProps } from "@mantine/core";
import React from "react";

export const StyledStepper = (props: StepperProps) => {
  return (
    <Stepper
      styles={{
        stepBody: {
          display: "none",
        },

        step: {
          padding: 0,
        },

        stepIcon: {
          borderWidth: 4,
        },

        separator: {
          marginLeft: -2,
          marginRight: -2,
          height: 10,
        },

        steps: {
          margin: "0 auto",
          maxWidth: 484,
        },
      }}
      {...props}
    />
  );
};
