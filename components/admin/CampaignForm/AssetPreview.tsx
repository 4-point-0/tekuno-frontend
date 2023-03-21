import { FileDto } from "@/services/api/admin/adminSchemas";
import { MIME_TYPES } from "@mantine/dropzone";
import { Box, Image } from "@mantine/core";
import { Video } from "@/components/core/Video";

interface AssetPreviewProps {
  file: FileDto;
  isCollected?: boolean;
}

export const AssetPreview = ({ file, isCollected }: AssetPreviewProps) => {
  const imageTypes = [
    MIME_TYPES.png,
    MIME_TYPES.jpeg,
    MIME_TYPES.gif,
  ] as Array<string>;
  const videoTypes = [MIME_TYPES.mp4] as Array<string>;

  return (
    <Box
      opacity={isCollected === false ? 0.5 : 1}
      sx={{
        borderRadius: 16,
        overflow: "hidden",
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
