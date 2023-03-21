import { Center, Container, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren } from "react";

const AdminGuardContext = createContext<null>(null);

export const AdminGuard = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const isAdminRoute = router.route.startsWith("/admin");

  const { status } = useSession({ required: isAdminRoute });

  return (
    <AdminGuardContext.Provider value={null}>
      {isAdminRoute && status !== "authenticated" ? (
        <Container h="calc(100vh - 16px)">
          <Center h="100%">
            <Loader color="indigo" />
          </Center>
        </Container>
      ) : (
        children
      )}
    </AdminGuardContext.Provider>
  );
};
