import { Box, Flex, Header, Image } from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren } from "react";

export const AdminHeader = ({ children }: PropsWithChildren) => {
  return (
    <Header height={60} p="xs">
      <Flex align="center" justify="space-between" h="100%">
        <Link href="/admin">
          <Box w={120}>
            <Image src="/tekuno.svg" alt="Tekuno logo"></Image>
          </Box>
        </Link>

        {children}
      </Flex>
    </Header>
  );
};
