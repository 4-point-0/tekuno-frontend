import { Input, InputWrapperProps } from "@mantine/core";
import React from "react";

export const Field: React.FC<InputWrapperProps> = (props) => {
  return (
    <Input.Wrapper
      styles={{
        label: {
          fontWeight: 600,
          fontSize: 16,
        },
      }}
      {...props}
    />
  );
};
