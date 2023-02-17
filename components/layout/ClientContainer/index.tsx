import { Container, MediaQuery, Paper } from "@mantine/core";
import React, { PropsWithChildren } from "react";

export const ClientContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Container fluid p={0} sx={{ margin: -16, maxWidth: "unset" }}>
          <Paper>
            <Container pt={8}>{children}</Container>
          </Paper>
        </Container>
      </MediaQuery>

      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <Container size="xl">
          <Paper radius="lg">
            <Container py={40}>{children}</Container>
          </Paper>
        </Container>
      </MediaQuery>
    </>
  );
};
