import { MantineSize } from "@mantine/core";
import React from "react";
import { Download } from "tabler-icons-react";
import saveAs from "file-saver";

import { FileDto } from "@/services/api/admin/adminSchemas";
import {
  fetchCampaignUserControllerGetNftMedia,
  useCampaignUserControllerGetNftMedia,
} from "@/services/api/client/clientComponents";
import { IndigoButton } from "../IndigoButton";

interface IDownloadBadgeProps {
  document: FileDto;
  size?: MantineSize;
}

export const DownloadBadge: React.FC<IDownloadBadgeProps> = ({
  document,
  size = "xs",
}) => {
  const { refetch, isFetching } = useCampaignUserControllerGetNftMedia(
    {
      pathParams: { fileId: document.id },
    },
    {
      enabled: false,
      onSuccess: (media) => {
        saveAs(media as Blob, document.name);
      },
    }
  );

  const handleDownload = async () => {
    refetch();
  };

  return (
    <IndigoButton
      leftIcon={<Download size={14} />}
      size={size}
      onClick={handleDownload}
      loading={isFetching}
      styles={{
        label: {
          display: "inline-block",
          height: "unset",
          maxWidth: "24ch",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        },
      }}
    >
      {document.name}
    </IndigoButton>
  );
};
