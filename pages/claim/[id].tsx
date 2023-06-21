import { Text } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { NftDetails } from "@/components/client/NftDetails";
import {
  fetchNftControllerFindOneNft,
  useNftControllerFindOneNft,
} from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";

import { ClientContainer } from "../../components/layout/ClientContainer";

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

const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

const ClaimPage: NextPage<ClaimPageProps> = ({ initialData }) => {
  const [recaptchaIsDone, setRecaptchaIsDone] = useState(false);

  const { data: nft } = useNftControllerFindOneNft(
    { pathParams: { nftId: initialData?.id as string } },
    { enabled: Boolean(initialData?.id), initialData }
  );

  const onChange = () => {
    setRecaptchaIsDone(true);
  };

  if (!recaptchaIsDone) {
    return (
      <ClientContainer>
        <Text pb={30} size="xl" fw={700}>
          Hold on tight, adventurer! <br /> Before we continue, we must ensure
          you are not a robot in disguise. Show us your human-like intelligence
          by completing the reCaptcha challenge.
        </Text>
        {key && <ReCAPTCHA sitekey={key} onChange={onChange} />}
      </ClientContainer>
    );
  }

  return <>{nft && <NftDetails key={nft.id} nft={nft} />}</>;
};

export default ClaimPage;
