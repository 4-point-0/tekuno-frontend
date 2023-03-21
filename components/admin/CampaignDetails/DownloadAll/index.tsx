import { Box, Portal } from "@mantine/core";
import { saveAs } from "file-saver";
import { useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { Download } from "tabler-icons-react";

import { IndigoButton } from "@/components/core/IndigoButton";
import { CampaignDto, NftDto } from "@/services/api/admin/adminSchemas";
import { getClaimURL } from "@/utils/qrcode";

interface DownloadAllProps {
  campaign: CampaignDto;
  nfts: NftDto[];
}

export const DownloadAll = ({ campaign, nfts }: DownloadAllProps) => {
  const ref = useRef<(QRCode | null)[]>([]);

  const handleDownloadAll = async () => {
    const JSZip = (await import("jszip")).default;

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
              value={getClaimURL(nft.id)}
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
