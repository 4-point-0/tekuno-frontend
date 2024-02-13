import { useRouter } from "next/router";
import { useEffect } from "react";

import { useNetwork } from "@/context/NetworkContext";
import { useIsClient } from "@/hooks/useIsClient";

export default function Home() {
  const isClient = useIsClient();
  const router = useRouter();
  const { user } = useNetwork();

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (user) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  }, [user, isClient, router]);

  return null;
}
