import { useNetwork } from "@/context/NetworkContext";
import { useNftControllerFindOne } from "@/services/api/client/clientComponents";

export function useNftOwned(nftId: string) {
  const { user } = useNetwork();

  const {
    data: userNft,
    isLoading,
    refetch,
  } = useNftControllerFindOne(
    {
      pathParams: {
        nftId: nftId,
        accountId: user?.profile?.wallet_address as string,
      },
    },
    {
      enabled: Boolean(user?.profile?.wallet_address),
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    refetch,
    isOwned: user && Boolean(userNft),
    isLoading: user && isLoading,
    isBurned: userNft?.is_burned,
  };
}
