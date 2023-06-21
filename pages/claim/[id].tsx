import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { NftDetails } from "@/components/client/NftDetails";
import {
  fetchNftControllerFindOneNft,
  useNftControllerFindOneNft,
} from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";

interface ClaimPageProps {
  initialData?: NftDto;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const nftId = ctx.query.id as string;

  try {
    const initialData = await fetchNftControllerFindOneNft({
      pathParams: { nftId },
    });

    if (initialData.nft_type.name === "reward") {
      throw new Error("Rewards can't be claimed");
    }

    return { props: { initialData, key: nftId } };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

const ClaimPage: NextPage<ClaimPageProps> = ({ initialData }) => {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;
  const [recaptchaIsDone, setRecaptchaIsDone] = useState(false);

  const { data: nft } = useNftControllerFindOneNft(
    { pathParams: { nftId: initialData?.id as string } },
    { enabled: Boolean(initialData?.id), initialData }
  );

  const onChange = () => {
    console.log("reCaptcha done");
    setRecaptchaIsDone(true);
  };

  if (!recaptchaIsDone) {
    return (
      <>
        <ReCAPTCHA sitekey={key} onChange={onChange} />
      </>
    );
  }

  return <>{nft && <NftDetails key={nft.id} nft={nft} />}</>;
};

export default ClaimPage;
