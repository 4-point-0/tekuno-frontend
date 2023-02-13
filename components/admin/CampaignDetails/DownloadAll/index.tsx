import React, { useRef } from "react";
import { Download } from "tabler-icons-react";
import { QRCode } from "react-qrcode-logo";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { IndigoButton } from "@/components/core/IndigoButton";
import { CampaignDto, NftDto } from "@/services/api/admin/adminSchemas";
import { Box, Portal } from "@mantine/core";

interface IDownloadAllProps {
  campaign: CampaignDto;
  nfts: Array<NftDto>;
}

export const DownloadAll: React.FC<IDownloadAllProps> = ({
  campaign,
  nfts,
}) => {
  const ref = useRef<Array<QRCode | null>>([]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const codes = zip.folder("codes");

    ref.current.forEach((component, i) => {
      if (component) {
        const canvas: HTMLCanvasElement = (component as any).canvas.current;
        const nft = nfts[i];
        const data = canvas.toDataURL().replace("data:image/png;base64", "");

        codes?.file(`${nft.name}.png`, data, { base64: true });
      }
    });

    const content = await zip.generateAsync({ type: "blob" });

    saveAs(content, `${campaign.name}.zip`);
  };

  return (
    <>
      <IndigoButton
        leftIcon={<Download size={14} />}
        onClick={handleDownloadAll}
      >
        Download all QR codes
      </IndigoButton>

      <Portal>
        <Box display="none">
          {nfts.map((nft, i) => (
            <QRCode
              key={nft.id}
              ref={(el) => (ref.current[i] = el)}
              style={{ display: "none" }}
              id={`download-all-${nft.id}`}
              value={`http://localhost:3000/claim/${nft.id}`}
              size={768}
              quietZone={24}
              ecLevel="H"
            />
          ))}
        </Box>
      </Portal>
    </>
  );
};
