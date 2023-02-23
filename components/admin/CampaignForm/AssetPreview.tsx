import React from "react";
import { FileDto } from "@/services/api/admin/adminSchemas";
import { MIME_TYPES } from "@mantine/dropzone";
import { Box, Image } from "@mantine/core";
import { Video } from "@/components/core/Video";

interface IAssetPreview {
  file: FileDto;
  isCollected?: boolean;
}

export const AssetPreview: React.FC<IAssetPreview> = ({
  file,
  isCollected,
}) => {
  const imageTypes = [
    MIME_TYPES.png,
    MIME_TYPES.jpeg,
    MIME_TYPES.gif,
  ] as Array<string>;
  const videoTypes = [MIME_TYPES.mp4] as Array<string>;

  return (
    <Box
      opacity={isCollected ? 1 : 0.5}
      sx={{
        borderRadius: 16,
        overflow: "hidden",
        filter: isCollected === undefined ? "blur(1px)" : "none",
      }}
    >
      {imageTypes.includes(file.mime_type) && (
        <Image src={file.url} alt={file.name} />
      )}
      {videoTypes.includes(file.mime_type) && (
        <Video file={file} autoPlay={isCollected} />
      )}
    </Box>
  );
};
