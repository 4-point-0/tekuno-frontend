import { keyStores } from "near-api-js";
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
  siteKey: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const nftId = ctx.query.id as string;
  const siteKey = process.env.RECAPTCHA_SITE_KEY;

  try {
    const initialData = await fetchNftControllerFindOneNft({
      pathParams: { nftId },
    });

    if (initialData.nft_type.name === "reward") {
      throw new Error("Rewards can't be claimed");
    }

    return { props: { initialData, key: nftId, siteKey } };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

// const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

const ClaimPage: NextPage<ClaimPageProps> = ({ initialData, siteKey }) => {
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
        <p>{siteKey}</p>
        {siteKey && <ReCAPTCHA sitekey={siteKey} onChange={onChange} />}
      </>
    );
  }

  return <>{nft && <NftDetails key={nft.id} nft={nft} />}</>;
};

export default ClaimPage;
