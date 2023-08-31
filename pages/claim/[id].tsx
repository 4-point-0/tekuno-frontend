import { Button, Stack, Text } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { NftDetails } from "@/components/client/NftDetails";
import { ClientContainer } from "@/components/layout/ClientContainer";
import { useRamper } from "@/context/RamperContext";
import {
  fetchNftControllerFindOneNft,
  fetchNftControllerPreviewOrder,
  useNftControllerFindOneNft,
} from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";
import { notifications } from "@/utils/notifications";

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
  const { user }: any = useRamper();
  const [isInApp, setIsInApp] = useState(false);
  const [nftOrder, setNftOrder] = useState<any>();

  useEffect(() => {
    let agent = window.navigator.userAgent;
    setIsInApp(
      agent.indexOf("Instagram") > -1 ||
        agent.indexOf("FBAN") > -1 ||
        agent.indexOf("FBAV") > -1 ||
        agent.indexOf("FB_IAB") > -1
    );
  }, []);
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;
  const [recaptchaIsDone, setRecaptchaIsDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNftControllerPreviewOrder({
          pathParams: {
            nftId: nft?.id as string,
          },
          headers: {
            authorization: `Bearer ${user?.userJwt}`,
          },
        });
        setNftOrder(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.userJwt) {
      fetchData();
    }
  }, [user]);

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

  if (isInApp) {
    return (
      <Stack>
        <Text align="center" fz={"md"} fw={700}>
          Claiming NFTs is not supported in a browser within apps
        </Text>
        <Text align="center" fz={"lg"} fw={700}>
          Please visit this page in your mobile browser to claim your NFT
        </Text>
        <Button
          mt={"lg"}
          variant="filled"
          color="dark"
          radius={"xl"}
          size="lg"
          onClick={() => {
            notifications.create({ message: `` });

            navigator.clipboard.writeText(window.location.href);
            notifications.success({
              message: "Link copied to clipboard! 🎉",
            });
          }}
        >
          Copy Link
        </Button>
      </Stack>
    );
  }

  if (!nftOrder) {
    return <h1>hello</h1>;
  }

  return (
    <>{nft && <NftDetails key={nft.id} nft={nft} nftOrder={nftOrder} />}</>
  );
};

export default ClaimPage;
