import React, { useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { Box, Group } from "@mantine/core";
import { Download, Qrcode } from "tabler-icons-react";
import { saveAs } from "file-saver";

import { NftDto } from "@/services/api/admin/adminSchemas";
import { IndigoButton } from "@/components/core/IndigoButton";

interface IQRCodeProps {
  nft: NftDto;
}

export const QRPreview: React.FC<IQRCodeProps> = ({ nft }) => {
  const ref = useRef<QRCode>(null);

  const handleDowload = () => {
    const canvas = (ref.current as any).canvas.current as HTMLCanvasElement;
    saveAs(canvas.toDataURL(), `${nft.name}.png`);
  };

  return (
    <Group p="md">
      <QRCode
        style={{ display: "none" }}
        id={`preview-${nft.id}`}
        value={`http://localhost:3000/claim/${nft.id}`}
        size={88}
        quietZone={0}
        ecLevel="L"
      />

      <Box display="none">
        <QRCode
          ref={ref}
          style={{ display: "none" }}
          id={`download-${nft.id}`}
          value={`http://localhost:3000/claim/${nft.id}`}
          size={768}
          quietZone={24}
          ecLevel="H"
        />
      </Box>

      <IndigoButton
        leftIcon={<Download size={14} />}
        rightIcon={<Qrcode size={14} />}
        onClick={handleDowload}
      >
        Download
      </IndigoButton>
    </Group>
  );
};
