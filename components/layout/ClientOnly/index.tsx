import { PropsWithChildren } from "react";

import { useIsClient } from "@/hooks/useIsClient";

export const ClientOnly = ({ children }: PropsWithChildren) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};
