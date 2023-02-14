import { MAX_FILE_SIZE } from "@/components/admin/CampaignForm/FormContext";
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
  FileWithPath,
} from "@mantine/dropzone";
import React, { useMemo, useRef } from "react";
import { Photo, Upload, X } from "tabler-icons-react";

interface IDropzoneProps extends Partial<DropzoneProps> {
  title: string;
  description: string;
  label: string;
  error?: string;
  previewUrl?: string;
  formValue?: Array<FileWithPath>;
  dropzone: Omit<DropzoneProps, "children">;
}

export const Dropzone: React.FC<IDropzoneProps> = ({
  title,
  description,
  label,
  error,
  previewUrl,
  dropzone,
}) => {
  const openRef = useRef<() => void>(null);
  const theme = useMantineTheme();

  const { onDrop, ...rest } = dropzone;

  const handleDrop = (files: Array<FileWithPath>) => {
    onDrop(files);
  };

  return (
    <>
      <MantineDropzone
        styles={{
          root: {
            borderRadius: 32,
            paddingBottom: 32,
            borderColor: error ? theme.colors.red[6] : undefined,
            borderWidth: 1,
            backgroundImage: `url(${previewUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          },
          inner: { pointerEvents: "all" },
        }}
        onDrop={handleDrop}
        maxSize={MAX_FILE_SIZE}
        {...rest}
      >
        <Box
          sx={{
            color: error
              ? theme.colors.red[6]
              : previewUrl
              ? theme.white
              : theme.colors.dark,
            backgroundColor:
              previewUrl && theme.fn.rgba(theme.colors.gray[8], 0.5),
            maxWidth: "40%",
            minWidth: 400,
            margin: "0 auto",
            borderRadius: theme.radius.xl,
            padding: theme.spacing.sm,
          }}
        >
          <Stack
            align="center"
            spacing="xs"
            style={{ margin: "0 auto", maxWidth: 300, pointerEvents: "none" }}
          >
            <MantineDropzone.Accept>
              <Upload size={50} color={theme.colors[theme.primaryColor][6]} />
            </MantineDropzone.Accept>
            <MantineDropzone.Reject>
              <X size={50} color="red.6" />
            </MantineDropzone.Reject>
            <MantineDropzone.Idle>
              <Photo size={50} />
            </MantineDropzone.Idle>

            <Text size="xl" inline>
              {title}
            </Text>
            <Text size="sm" inline mt={7}>
              {description}
            </Text>
          </Stack>
        </Box>

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
      {error && (
        <Text size="xs" color="red.6">
          {error}
        </Text>
      )}
    </>
  );
};
