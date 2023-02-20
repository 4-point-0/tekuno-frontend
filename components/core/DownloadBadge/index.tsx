import { ActionIcon, MantineSize } from "@mantine/core";
import React from "react";
import { Download } from "tabler-icons-react";
import saveAs from "file-saver";

import { FileDto } from "@/services/api/admin/adminSchemas";
import { IndigoBadge } from "../IndigoBadge";
import { fetchCampaignUserControllerGetNftMedia } from "@/services/api/client/clientComponents";

interface IDownloadBadgeProps {
  document: FileDto;
  size?: MantineSize;
}

export const DownloadBadge: React.FC<IDownloadBadgeProps> = ({
  document,
  size = "lg",
}) => {
  const handleDownload = async () => {
    const media = await fetchCampaignUserControllerGetNftMedia({
      pathParams: { fileId: document.id },
    });

    saveAs(media as Blob, document.name);
  };

  return (
    <IndigoBadge
      key={document.name}
      onClick={handleDownload}
      sx={{ cursor: "pointer" }}
      size={size}
      leftSection={
        <ActionIcon variant="transparent" color="dark">
          <Download size={14} />
        </ActionIcon>
      }
    >
      {document.name}
    </IndigoBadge>
  );
};
