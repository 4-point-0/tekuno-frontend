import { MantineSize } from "@mantine/core";
import saveAs from "file-saver";
import { useState } from "react";
import { Download } from "tabler-icons-react";

import { FileDto } from "@/services/api/admin/adminSchemas";
import { fetchCampaignUserControllerGetNftMedia } from "@/services/api/client/clientComponents";

import { IndigoButton } from "../IndigoButton";

interface DownloadBadgeProps {
  document: FileDto;
  size?: MantineSize;
}

export const DownloadBadge = ({
  document,
  size = "xs",
}: DownloadBadgeProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleDownload = async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    const media = await fetchCampaignUserControllerGetNftMedia({
      pathParams: { fileId: document.id },
    });

    saveAs(media as Blob, document.name);

    setIsFetching(false);
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
