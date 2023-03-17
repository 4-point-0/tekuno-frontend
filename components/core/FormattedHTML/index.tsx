import { useIsClient } from "@/hooks/useIsClient";
import { Text, TextProps, useMantineTheme } from "@mantine/core";
import React from "react";

interface IFormattedHTMLProps extends TextProps {
  content?: string;
}

export const FormattedHTML: React.FC<IFormattedHTMLProps> = ({
  content,
  ...props
}) => {
  const isClient = useIsClient();
  const theme = useMantineTheme();

  if (!isClient) {
    return null;
  }

  return (
    <Text
      sx={{
        a: {
          color: theme.colors.grape[6],
          textDecoration: "none",
        },
      }}
      dangerouslySetInnerHTML={{ __html: content || "" }}
      {...props}
    />
  );
};
