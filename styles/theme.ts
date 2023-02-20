import { MantineThemeOverride } from "@mantine/core";
import { Open_Sans } from "@next/font/google";

const OpenSans = Open_Sans({ subsets: ["latin"] });

export const tekunoTheme: MantineThemeOverride = {
  colorScheme: "light",
  fontFamily: OpenSans.style.fontFamily,
  headings: { fontFamily: OpenSans.style.fontFamily },
  components: {
    Badge: {
      styles: {
        root: {
          textTransform: "none",
        },
      },
    },
    Button: {
      defaultProps: {
        radius: "lg",
      },
    },
    DatePicker: {
      styles: {
        label: {
          fontWeight: 600,
        },
      },
    },
    Input: {
      defaultProps: {
        radius: "lg",
      },
    },
    Switch: {
      styles: {
        label: {
          fontWeight: 600,
        },
      },
    },
    Text: {
      defaultProps: {
        component: "p",
        my: 0,
      },
    },
    Textarea: {
      defaultProps: {
        variant: "filled",
      },
    },
  },
};
