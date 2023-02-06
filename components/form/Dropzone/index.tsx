import {
  Group,
  useMantineTheme,
  Text,
  Stack,
  Button,
  Box,
} from "@mantine/core";
import {
  Dropzone as MantineDropzone,
  DropzoneProps,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import React, { useRef } from "react";
import { Photo, Upload, X } from "tabler-icons-react";

interface IDropzoneProps extends Partial<DropzoneProps> {
  title: string;
  description: string;
  label: string;
  dropzone: Omit<DropzoneProps, "children">;
}

export const Dropzone: React.FC<IDropzoneProps> = ({
  title,
  description,
  label,
  dropzone,
}) => {
  const openRef = useRef<() => void>(null);
  const theme = useMantineTheme();

  return (
    <MantineDropzone
      styles={{
        root: {
          borderRadius: 32,
          paddingBottom: 32,
        },
      }}
      {...dropzone}
    >
      <Stack
        align="center"
        spacing="xs"
        style={{ margin: "0 auto", maxWidth: 300, pointerEvents: "none" }}
      >
        <MantineDropzone.Accept>
          <Upload
            size={50}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </MantineDropzone.Accept>
        <MantineDropzone.Reject>
          <X
            size={50}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </MantineDropzone.Reject>
        <MantineDropzone.Idle>
          <Photo size={50} />
        </MantineDropzone.Idle>

        <Text size="xl" inline>
          {title}
        </Text>
        <Text size="sm" color="dimmed" inline mt={7}>
          {description}
        </Text>
      </Stack>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          transform: "translateY(50%)",
        }}
      >
        <Group position="center">
          <Button onClick={() => openRef.current?.()}>{label}</Button>
        </Group>
      </Box>
    </MantineDropzone>
  );
};
