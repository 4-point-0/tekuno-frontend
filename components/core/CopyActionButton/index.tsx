import {
  ActionIcon,
  ActionIconStylesParams,
  CopyButton,
  MantineColor,
  Styles,
  Tooltip,
} from "@mantine/core";
import React from "react";
import { Check, Copy } from "tabler-icons-react";

interface ICopyActionButtonProps {
  value: string;
  color?: MantineColor;
  styles?: Styles<"root", ActionIconStylesParams>;
}

export const CopyActionButton: React.FC<ICopyActionButtonProps> = ({
  value,
  color = "primary",
  styles = {},
}) => {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="bottom">
          <ActionIcon
            radius="xl"
            variant="light"
            color={copied ? "teal" : color}
            onClick={copy}
            styles={styles}
          >
            {copied ? (
              <Check size={16} />
            ) : (
              <Copy color={color === "indigo" ? "#000" : undefined} size={16} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};
