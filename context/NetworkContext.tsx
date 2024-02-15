import { useMantineTheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  useCurrentAccount,
  useDisconnectWallet,
  useSignPersonalMessage,
} from "@mysten/dapp-kit";
import {
  AUTH_PROVIDER,
  getUser as getUserRamper,
  init,
  openWallet as openWalletRamper,
  RamperInstance,
  signIn as signInRamper,
  signOut as signOutRamper,
  THEME,
  WALLET_PROVIDER,
} from "@ramper/near";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchUserControllerAuthenticate,
  fetchUserControllerRegister,
  useChainControllerFindAll,
} from "@/services/api/client/clientComponents";
import { UserDto } from "@/services/api/client/clientSchemas";
import { notifications } from "@/utils/notifications";

import { useAuthControllerVerifySuiUser } from "../services/api/admin/adminComponents";

interface UseNetwork {
  user: UserDto | null;
  loading: boolean;
  openWallet: () => void;
  signIn: () => Promise<void>;
  signOut: () => void;
  refreshUserData: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  signInSuiUser: () => Promise<void>;
  signOutSuiUser: () => void;
  refreshSuiUserData: () => Promise<void>;
  refreshSuiTokens: () => Promise<void>;
}

const NetworkContext = createContext<UseNetwork | null>(null);

export const NetworkProvider = ({ children }: PropsWithChildren) => {
  const theme = useMantineTheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [ramper, setRamper] = useState<RamperInstance>();

  const { mutate: disconnectWallet } = useDisconnectWallet();

  const currentChain = "near";

  const { data: chainData } = useChainControllerFindAll({});

  const verifySuiUser = useAuthControllerVerifySuiUser({
    onSuccess: (data) => {
      console.log("JWT Token:", data);
      return data;
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const suiAddress = useCurrentAccount()?.address;

  const { mutate: signPersonalMessage } = useSignPersonalMessage();

  const [user, setUser] = useLocalStorage<UserCredentials | null>({
    key: "tkn_user",
    deserialize: (value) => (value === undefined ? null : JSON.parse(value)),
    serialize: (value) => JSON.stringify(value),
    defaultValue: null,
    getInitialValueInEffect: true,
  });

  //Ramper
  useEffect(() => {
    const ramperTheme =
      theme.colorScheme === "light" ? THEME.LIGHT : THEME.DARK;

    const initRamper = async () => {
      const instance = await init({
        appName: "Tekuno",
        appId: process.env.NEXT_PUBLIC_RAMPER_APP_ID,
        authProviders: [
          AUTH_PROVIDER.GOOGLE,
          AUTH_PROVIDER.FACEBOOK,
          // AUTH_PROVIDER.TWITTER,
          AUTH_PROVIDER.APPLE,
          AUTH_PROVIDER.EMAIL,
        ],
        walletProviders: [WALLET_PROVIDER.MY_NEAR_WALLET],
        network: process.env.NEXT_PUBLIC_NETWORK,
        theme: theme.colorScheme === "dark" ? THEME.DARK : THEME.LIGHT,
        logoURI: `https://i.imgur.com/BF6sZhU.png`, // TODO: Point this to production url later
        issueIdToken: true,
        // appId: "siycfmkhwu", // TODO: Change this to production app id later
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
    await signInUser();
  };

  const signOut = () => {
    setUser(null);
    signOutRamper();
  };

  const refreshTokens = async () => {
    if (!user) return;

    const walletType = user?.provider ? "Ramper" : "SelfCreated";

    const userData = await fetchUserControllerRegister({
      body: {
        email: user?.email,
        wallet_address: user?.profile?.wallet_address!,
        chain_id: user?.profile?.chain_id!,
        wallet_type: walletType,
      },
    });

    const newUser = {
      ...userData,
      userJwt: user?.userJwt,
    };

    setUser(newUser);
  };

  const refreshUserData = async () => {
    await signInUser();
    await registerUser();
  };

  const encryptSymmetric = async (plaintext: string, key: string) => {
    // create a random 96-bit initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // encode the text you want to encrypt
    const encodedPlaintext = new TextEncoder().encode(plaintext);

    // prepare the secret key for encryption
    const secretKey = await crypto.subtle.importKey(
      "raw",
      Buffer.from(key, "base64"),
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    // encrypt the text with the secret key
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      secretKey,
      encodedPlaintext
    );

    // return the encrypted text "ciphertext" and the IV
    // encoded in base64
    return {
      ciphertext: Buffer.from(ciphertext).toString("base64"),
      iv: Buffer.from(iv).toString("base64"),
    };
  };

  const signInUser = async () => {
    const user = getUserRamper();
    if (!user) {
      return;
    }

    const key = process.env.NEXT_PUBLIC_RAMPER_ENCRYPT as string;
    const { ciphertext, iv } = await encryptSymmetric(
      user?.wallets[currentChain].publicKey,
      key
    );

    try {
      const userData = await fetchUserControllerAuthenticate({
        body: {
          token: ciphertext,
          pass: iv,
        },
      });

      return userData;
    } catch (error) {
      console.error("Authentication failed");
    }
  };

  type UserCredentials = UserDto & {
    userJwt: string;
  };

  const registerUser = async () => {
    const user = getUserRamper();

    if (!user) {
      return;
    }

    notifications.create({ message: "Connecting you to Tekuno" });

    const userJWT = await signInUser();

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

      const userCredentials = async () => {
        const userData = await fetchUserControllerRegister({
          body: {
            email: user?.email,
            wallet_address: walletAddress,
            chain_id: chainId,
            wallet_type: walletType,
          },
        });
        return {
          ...userData,
          userJwt: userJWT?.token || "",
        };
      };

      setUser(await userCredentials());

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

  const signInSuiUser = async () => {
    setLoading(true);
    // const result = await signInRamper();

    // // Check if user stopped the sing in process
    // if (!result.user) {
    //   setLoading(false);
    //   return;
    // }

    await signSuiMessage();
    // await signInUser();
  };

  // TODO: refactor implement suiSignMessage
  const signSuiMessage = async () => {
    await signPersonalMessage(
      {
        message: new TextEncoder().encode(suiAddress),
      },
      {
        onSuccess: (result) => {
          // TODO: handle signature verification
          const jwtToken = verifySuiUser.mutate({
            body: {
              signature: result.signature,
              bytes: result.bytes,
              wallet_address: suiAddress || "",
              zkLogin: true,
            },
          });

          console.log("jwtToken2", jwtToken);

          registerSuiUser(jwtToken);
          return result;
        },
      }
    );
  };

  const registerSuiUser = async (jwtToken: any) => {
    notifications.create({ message: "Connecting you to Tekuno" });

    // const { token } = jwtToken;

    // console.log("jwtToken", token);

    const userJWT = jwtToken;

    const suiChain = chainData?.results.find((chain) => chain.name === "sui");
    const walletAddress = suiAddress;
    const walletType = "SelfCreated";

    if (!suiChain || !walletAddress) {
      notifications.error({
        message: "Something went wrong. Please try again.",
      });
      signOutSuiUser();
      return;
    }

    try {
      setLoading(true);

      const userCredentials = async () => {
        const userData = await fetchUserControllerRegister({
          body: {
            email: undefined,
            wallet_address: walletAddress,
            chain_id: suiChain.id,
            wallet_type: walletType,
          },
        });
        return {
          ...userData,
          userJwt: userJWT?.token || "",
        };
      };

      setUser(await userCredentials());

      notifications.success({
        message: "Connected successfully.",
      });
    } catch {
      notifications.error({
        message: "Something went wrong. Please try again.",
      });

      signOutSuiUser();
    } finally {
      setLoading(false);
    }
  };

  const signOutSuiUser = () => {
    disconnectWallet();
    setUser(null);
  };

  const refreshSuiTokens = async () => {};

  const refreshSuiUserData = async () => {};

  return (
    <NetworkContext.Provider
      value={{
        user,
        loading,
        openWallet,
        signIn,
        signOut,
        refreshUserData,
        refreshTokens,
        signInSuiUser,
        signOutSuiUser,
        refreshSuiTokens,
        refreshSuiUserData,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export function useNetwork() {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error("user must be used within a NetworkContext");
  }

  return context;
}
