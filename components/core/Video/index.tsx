import { useIsClient } from "@/hooks/useIsClient";
import { FileDto } from "@/services/api/admin/adminSchemas";
import { AspectRatio, Skeleton } from "@mantine/core";
import { useSetState } from "@mantine/hooks";

interface VideoProps {
  file: FileDto;
  autoPlay?: boolean;
  maxWidth?: number;
}

export const Video = ({ file, autoPlay = true }: VideoProps) => {
  const isClient = useIsClient();
  const [{ x, y, loading }, setDimensions] = useSetState({
    x: 0,
    y: 0,
    loading: true,
  });

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoEl = e.target as HTMLVideoElement;

    setDimensions({
      x: videoEl.videoWidth,
      y: videoEl.videoHeight,
      loading: false,
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <Skeleton visible={loading}>
      <AspectRatio ratio={x / y} w={x}>
        <video
          autoPlay={autoPlay}
          loop
          playsInline
          muted
          disablePictureInPicture
          onLoadedMetadata={handleVideoLoad}
        >
          <source src={file.url} type={file.mime_type}></source>
        </video>
      </AspectRatio>
    </Skeleton>
  );
};
