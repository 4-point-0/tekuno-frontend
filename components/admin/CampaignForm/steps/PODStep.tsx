import { Stack } from "@mantine/core";
import React from "react";

import { useFormContext } from "../FormContext";
import { NFTForm } from "../NFTForm";

interface IPODStepProps {
  hasPoap: boolean;
}

export const PODStep: React.FC<IPODStepProps> = ({ hasPoap }) => {
  const form = useFormContext();

  return (
    <Stack>
      <NFTForm formKey="poap" />
    </Stack>
  );
};
