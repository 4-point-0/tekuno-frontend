import { Box, Group } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { saveAs } from "file-saver";
import { RefObject, useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { Download, ExternalLink } from "tabler-icons-react";

import { CopyActionButton } from "@/components/core/CopyActionButton";
import { IndigoButton } from "@/components/core/IndigoButton";
import { NftDto } from "@/services/api/admin/adminSchemas";
import { getClaimURL } from "@/utils/qrcode";

interface QRCodeProps {
  nft: NftDto;
}

export const QRPreview = ({ nft }: QRCodeProps) => {
  const ref = useRef<QRCode>(null);

  const handleDowload = () => {
    const canvas = (
      ref.current as unknown as { canvas: RefObject<HTMLCanvasElement> }
    ).canvas.current;
    if (canvas) {
      saveAs(canvas.toDataURL(), `${nft.name}.png`);
    }
  };

  const url = getClaimURL(nft.id);

  return (
    <Group p="md">
      {/* <QRCode
        style={{ display: "none" }}
        id={`preview-${nft.id}`}
        value={`http://localhost:3000/claim/${nft.id}`}
        size={88}
        quietZone={0}
        ecLevel="L"
      /> */}

      <Box display="none">
        <QRCode
          ref={ref}
          style={{ display: "none" }}
          id={`download-${nft.id}`}
          value={url}
          size={768}
          quietZone={24}
          ecLevel="H"
        />
      </Box>

      <IndigoButton leftIcon={<Download size={14} />} onClick={handleDowload}>
        Download QR
      </IndigoButton>

      <IndigoButton
        component={NextLink}
        href={url}
        target="_blank"
        rel="norefferer"
        legacyBehavior
        leftIcon={<ExternalLink size={14} />}
      >
        Open
      </IndigoButton>

      <CopyActionButton color="indigo" value={url} />
    </Group>
  );
};
