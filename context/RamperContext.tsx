import {
  fetchUserControllerRegister,
  useChainControllerFindAll,
} from "@/services/api/client/clientComponents";
import { UserDto } from "@/services/api/client/clientSchemas";
import { notifications } from "@/utils/notifications";
import { useMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  AUTH_PROVIDER,
  getUser as getUserRamper,
  init,
  openWallet as openWalletRamper,
  signIn as signInRamper,
  signOut as signOutRamper,
  SUPPORTED_NEAR_NETWORKS,
  THEME,
  WALLET_PROVIDER,
  RamperInstance,
} from "@ramper/near";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

interface UseRamper {
  user: UserDto | null;
  loading: boolean;
  openWallet: () => void;
  signIn: () => Promise<void>;
  signOut: () => void;
  refreshUserData: () => Promise<void>;
}

const RamperContext = React.createContext<UseRamper | null>(null);

export const RamperProvider = ({ children }: any) => {
  const theme = useMantineTheme();

  const [user, setUser] = useLocalStorage<UserDto | null>({
    key: "tkn_user",
    deserialize: (value) => (value === undefined ? null : JSON.parse(value)),
    serialize: (value) => JSON.stringify(value),
    defaultValue: null,
    getInitialValueInEffect: true,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { isLoading, data: chainData } = useChainControllerFindAll({});

  const [ramper, setRamper] = useState<RamperInstance>();

  useEffect(() => {
    const ramperTheme =
      theme.colorScheme === "light" ? THEME.LIGHT : THEME.DARK;

    const initRamper = async () => {
      const instance = await init({
        appName: "Tekuno",
        authProviders: [
          AUTH_PROVIDER.GOOGLE,
          AUTH_PROVIDER.FACEBOOK,
          AUTH_PROVIDER.TWITTER,
          AUTH_PROVIDER.APPLE,
          AUTH_PROVIDER.EMAIL,
        ],
        walletProviders: [WALLET_PROVIDER.NEAR_WALLET],
        network: process.env.NEXT_PUBLIC_NETWORK,
        theme: theme.colorScheme === "dark" ? THEME.DARK : THEME.LIGHT,
        logoURI: `https://i.imgur.com/BF6sZhU.png`, // TODO: Point this to production url later
        appId: "siycfmkhwu", // TODO: Change this to production app id later
      });

      setRamper(instance);
    };

    if (!(ramper && ramper.config.theme === ramperTheme)) {
      initRamper();
    }
  }, [theme.colorScheme, ramper, setRamper]);

  const openWallet = () => {
    openWalletRamper();
  };

  const signIn = async () => {
    setLoading(true);
    const result = await signInRamper();

    // Check if user stopped the sing in process
    if (!result.user) {
      setLoading(false);
      return;
    }

    await registerUser();
  };

  const signOut = () => {
    setUser(null);
    signOutRamper();
  };

  const refreshUserData = async () => {
    await registerUser();
  };

  const registerUser = async () => {
    const user = getUserRamper();

    if (!user) {
      return;
    }

    notifications.create({ message: "Connecting you to Tekuno" });

    const currentChain = "near";
    const chainId = chainData?.results.filter(
      (chain) => chain.name === currentChain
    )[0].id;
    const walletAddress = user?.wallets[currentChain].publicKey || "";
    const walletType =
      user?.signupSource === "near_wallet" ? "SelfCreated" : "Ramper";

    if (!chainId || !walletAddress) {
      notifications.error({
        message: "Something went wrong. Please try again.",
      });
      signOut();
      return;
    }

    try {
      setLoading(true);
      const userData = await fetchUserControllerRegister({
        body: {
          email: user?.email,
          wallet_address: walletAddress,
          chain_id: chainId,
          wallet_type: walletType,
        },
      });

      setUser(userData);

      notifications.success({
        message: "Connected successfully.",
      });
    } catch {
      notifications.error({
        message: "Something went wrong. Please try again.",
      });

      signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <RamperContext.Provider
      value={{
        user,
        loading,
        openWallet,
        signIn,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </RamperContext.Provider>
  );
};

export function useRamper() {
  const context = useContext(RamperContext);

  if (!context) {
    throw new Error("userRamper must be used within a RamperContext");
  }

  return context;
}
