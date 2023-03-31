import { Text, TextProps, useMantineTheme } from "@mantine/core";

import { ClientOnly } from "@/components/layout/ClientOnly";

interface FormattedHTMLProps extends TextProps {
  content?: string;
}

export const FormattedHTML = ({ content, ...props }: FormattedHTMLProps) => {
  const theme = useMantineTheme();

  return (
    <ClientOnly>
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
    </ClientOnly>
  );
};
