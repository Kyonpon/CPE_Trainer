import React from "react";
import TwoInputVizualizer from "../../components/ICTester/TwoInputVizualizer";
import { Box, Button, Heading } from "@chakra-ui/react";

function ICTesterHome() {
  return (
    <Box>
      <Heading>ICTester</Heading>
      <Box display="flex" justifyContent="center">
        <TwoInputVizualizer></TwoInputVizualizer>
      </Box>
      <Button>Test</Button>
    </Box>
  );
}

export default ICTesterHome;
