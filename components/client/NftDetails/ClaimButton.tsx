import { Button } from "@mantine/core";

import { ClientOnly } from "@/components/layout/ClientOnly";
import { useRamper } from "@/context/RamperContext";
import { useNftOwned } from "@/hooks/useNftOwned";
import { useNftControllerDropNft } from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";
import { notifications } from "@/utils/notifications";

interface ClaimButtonProps {
  nft: NftDto;
  onClaim: () => void;
}

export const ClaimButton = ({ nft, onClaim }: ClaimButtonProps) => {
  const { user, loading: isRamperLoading, signIn } = useRamper();
  const { isOwned, isLoading, refetch } = useNftOwned(nft.id);
  const drop = useNftControllerDropNft({ retry: false });

  const handleClick = async () => {
    if (user) {
      try {
        notifications.create({ message: `Claiming ${nft.name}...` });

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
        disabled={drop.isLoading}
        loading={drop.isLoading || isRamperLoading}
        loaderPosition="right"
      >
        {user ? "Claim" : "Connect to Tekuno"}
      </Button>
    </ClientOnly>
  );
};
