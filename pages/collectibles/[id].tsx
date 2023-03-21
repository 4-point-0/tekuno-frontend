import { GetServerSideProps, NextPage } from "next";

import { NftDetails } from "@/components/client/NftDetails";
import { ClientContainer } from "@/components/layout/ClientContainer";
import {
  fetchNftControllerFindOneNft,
  useNftControllerFindOneNft,
} from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";

interface CollectiblePageProps {
  initialData?: NftDto;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const nftId = ctx.query.id as string;

  try {
    const initialData = await fetchNftControllerFindOneNft({
      pathParams: { nftId },
    });

    return { props: { initialData, key: nftId } };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

const CollectiblePage: NextPage<CollectiblePageProps> = ({ initialData }) => {
  const { data: nft } = useNftControllerFindOneNft(
    { pathParams: { nftId: initialData?.id as string } },
    { enabled: Boolean(initialData?.id), initialData }
  );

  return (
    <ClientContainer key={nft?.id}>
      {nft && <NftDetails key={nft.id} nft={nft} disableClaim />}
    </ClientContainer>
  );
};

export default CollectiblePage;
