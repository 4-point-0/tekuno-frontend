import { useMantineTheme } from "@mantine/core";
import {
  AUTH_PROVIDER,
  getUser as getUserRamper,
  init,
  openWallet as openWalletRamper,
  signIn as signInRamper,
  signOut as signOutRamper,
  SUPPORTED_NEAR_NETWORKS,
  THEME,
  User,
  WALLET_PROVIDER,
} from "@ramper/near";
import React, { useContext, useEffect, useState } from "react";

interface UseRamper {
  user: User | null;
  publicKey: string | null;
  loading: boolean;
  openWallet: () => void;
  signIn: () => Promise<void>;
  signOut: () => void;
  refreshUserData: () => void;
}

const RamperContext = React.createContext<UseRamper | null>(null);

export const RamperProvider = ({ children }: any) => {
  const theme = useMantineTheme();
  const [user, setUser] = useState<User | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initRamper = async () => {
      await init({
        appName: "Tekuno",
        authProviders: [
          AUTH_PROVIDER.GOOGLE,
          AUTH_PROVIDER.FACEBOOK,
          AUTH_PROVIDER.TWITTER,
          AUTH_PROVIDER.APPLE,
          AUTH_PROVIDER.EMAIL,
        ],
        walletProviders: [WALLET_PROVIDER.NEAR_WALLET],
        network: SUPPORTED_NEAR_NETWORKS.TESTNET,
        theme: theme.colorScheme === "dark" ? THEME.DARK : THEME.LIGHT,
        logoURI: `https://i.imgur.com/BF6sZhU.png`, // TODO: Point this to production url later
        appId: "siycfmkhwu", // TODO: Change this to production app id later
      });

      const user = getUserRamper();
      setUser(user);
      setPublicKey(user?.wallets["near"].publicKey ?? null);
    };

    initRamper();
  }, [theme.colorScheme]);

  useEffect(() => {
    if (publicKey) {
      localStorage.setItem("account_id", publicKey);
    } else {
      localStorage.removeItem("account_id");
    }
  }, [publicKey]);

  const openWallet = () => {
    openWalletRamper();
  };

  const signIn = async () => {
    setLoading(true);
    await signInRamper();
    const user = getUserRamper();
    setUser(user);
    setPublicKey(user?.wallets["near"].publicKey ?? null);
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    setPublicKey(null);
    signOutRamper();
  };

  const refreshUserData = () => {
    const user = getUserRamper();
    setUser(user);
    setPublicKey(user?.wallets["near"].publicKey ?? null);
  };

  return (
    <RamperContext.Provider
      value={{
        user,
        publicKey,
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
