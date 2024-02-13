import { Button } from "@mantine/core";

import { ClientOnly } from "@/components/layout/ClientOnly";
import { useNetwork } from "@/context/NetworkContext";
import { useNftOwned } from "@/hooks/useNftOwned";
import {
  useNftControllerCreatePayment,
  useNftControllerDropNft,
} from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";
import { notifications } from "@/utils/notifications";

interface ClaimButtonProps {
  nft: NftDto;
  isDisabled: boolean;
  onClaim: () => void;
  shouldCreateOrder: boolean;
}

export const ClaimButton = ({
  nft,
  onClaim,
  isDisabled,
  shouldCreateOrder,
}: ClaimButtonProps) => {
  const { user, loading: isRamperLoading, signIn }: any = useNetwork();
  const { isOwned, isLoading, refetch } = useNftOwned(nft.id);
  const createNftOrder = useNftControllerCreatePayment({});
  const drop = useNftControllerDropNft({ retry: false });

  const handleClick = async () => {
    if (user && user.profile) {
      try {
        notifications.create({ message: `Claiming ${nft.name}...` });

        if (shouldCreateOrder) {
          await createNftOrder.mutateAsync({
            body: {
              nft_id: nft.id,
              account_id: user.profile?.wallet_address,
            },
            headers: {
              authorization: `Bearer ${user.userJwt}`,
            },
          });
        }

        await drop.mutateAsync({
          pathParams: {
            nftId: nft?.id as string,
            accountId: user.profile?.wallet_address as string,
          },
        });

        notifications.success({ message: `${nft.name} claimed! 🎉` });

        refetch();
        onClaim();
      } catch {
        notifications.error({});
      }
    } else {
      await signIn();
    }
  };

  if (isOwned || isLoading) {
    return null;
  }

  return (
    <ClientOnly>
      <Button
        size="lg"
        radius="xl"
        color={user ? undefined : "dark"}
        fullWidth
        variant="filled"
        onClick={handleClick}
        disabled={drop.isLoading || isDisabled}
        loading={drop.isLoading || isRamperLoading}
        loaderPosition="right"
      >
        {user ? "Claim" : "Connect to Tekuno"}
      </Button>
    </ClientOnly>
  );
};
