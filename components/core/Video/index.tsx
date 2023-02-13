import { FileDto } from "@/services/api/admin/adminSchemas";
import { AspectRatio, Skeleton } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import React, { useState } from "react";

interface IVideoProps {
  file: FileDto;
  maxWidth?: number;
}

export const Video: React.FC<IVideoProps> = ({ file, maxWidth = 320 }) => {
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

  return (
    <Skeleton visible={loading}>
      <AspectRatio ratio={x / y} w={Math.min(maxWidth, x)}>
        <video
          autoPlay
          loop
          playsInline
          disablePictureInPicture
          onLoadedMetadata={handleVideoLoad}
        >
          <source src={file.url} type={file.mime_type}></source>
        </video>
      </AspectRatio>
    </Skeleton>
  );
};