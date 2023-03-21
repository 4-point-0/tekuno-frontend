import { Text, TextProps, useMantineTheme } from "@mantine/core";

import { useIsClient } from "@/hooks/useIsClient";

interface FormattedHTMLProps extends TextProps {
  content?: string;
}

export const FormattedHTML = ({ content, ...props }: FormattedHTMLProps) => {
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
