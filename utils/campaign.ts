import { CampaignDto } from "@/services/api/admin/adminSchemas";
import dayjs from "dayjs";

export const getCampaignAssets = (campaign?: CampaignDto) => {
  const image = campaign?.files?.find(({ tags }) => tags.includes("image"));

  const documents = campaign?.files?.filter(
    ({ tags }) => !tags.includes("image")
  );

  const reward = campaign?.nfts?.find(
    ({ nft_type: { name } }) => name === "reward"
  );

  const nfts = campaign?.nfts?.filter(
    ({ nft_type: { name } }) => name !== "reward"
  );

  return {
    image,
    documents,
    reward,
    nfts,
  };
};

export const hasEnded = ({ status, end_date }: CampaignDto) => {
  return (
    status === "Ended" ||
    (end_date
      ? dayjs(end_date).isBefore(dayjs(new Date()).endOf("day"))
      : false)
  );
};
