import { Center, Container, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

const AdminGuardContext = React.createContext<null>(null);

export const AdminGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const isAdminRoute = router.route.startsWith("/admin");

  const { status } = useSession({ required: isAdminRoute });

  console.log(status);

  return (
    <AdminGuardContext.Provider value={null}>
      {isAdminRoute && status !== "authenticated" ? (
        <Container h="calc(100vh - 16px)">
          <Center h="100%">
            <Loader />
          </Center>
        </Container>
      ) : (
        children
      )}
    </AdminGuardContext.Provider>
  );
};
