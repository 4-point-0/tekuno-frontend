import { ActionIcon } from "@mantine/core";
import React from "react";
import { Download } from "tabler-icons-react";

import { FileDto } from "@/services/api/admin/adminSchemas";
import { IndigoBadge } from "../IndigoBadge";

interface IDownloadBadgeProps {
  document: FileDto;
}

export const DownloadBadge: React.FC<IDownloadBadgeProps> = ({ document }) => {
  return (
    <IndigoBadge
      key={document.name}
      component="a"
      href={document.url}
      target="_blank"
      referrerPolicy="no-referrer"
      sx={{ cursor: "pointer" }}
      size="lg"
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
