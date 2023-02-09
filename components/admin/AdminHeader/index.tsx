import { Box, Flex, Header, Image } from "@mantine/core";
import Link from "next/link";

export const AdminHeader = () => {
  return (
    <Header height={60} p="xs">
      <Flex align="center" h="100%">
        <Link href="/admin">
          <Box w={120}>
            <Image src="/tekuno.svg" alt="Tekuno logo"></Image>
          </Box>
        </Link>
      </Flex>
    </Header>
  );
};
