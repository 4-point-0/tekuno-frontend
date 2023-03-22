import { GetServerSideProps, NextPage } from "next";

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
  const { data: nft } = useNftControllerFindOneNft(
    { pathParams: { nftId: initialData?.id as string } },
    { enabled: Boolean(initialData?.id), initialData }
  );

  return <>{nft && <NftDetails key={nft.id} nft={nft} />}</>;
};

export default ClaimPage;
