import { Container, MediaQuery, Paper } from "@mantine/core";
import { PropsWithChildren } from "react";

export const ClientContainer = ({ children }: PropsWithChildren) => {
  return (
    <>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Container fluid p={0} sx={{ margin: -16, maxWidth: "unset" }}>
          <Paper>
            <Container pt={8} pb={96}>
              {children}
            </Container>
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
