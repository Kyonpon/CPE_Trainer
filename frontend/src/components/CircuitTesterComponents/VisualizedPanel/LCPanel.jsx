import { Box, Grid, GridItem, HStack } from "@chakra-ui/react";
import React from "react";
import BananaSocket from "./BananaSocket";

function LCPanel({ outputs, inputs }) {
  const labelsOutputs = Object.keys(outputs);
  const labelsInputs = Object.keys(inputs);
  const statusOutputs = [];
  const statusInputs = [];
  for (let i = 0; i < 16; i++) {
    statusOutputs.push(0);
  }
  for (let i = 0; i < 4; i++) {
    statusInputs.push(0);
  }

  for (let i = 0; i < labelsOutputs.length; i++) {
    statusOutputs[i] = 1;
  }
  for (let i = 0; i < labelsInputs.length; i++) {
    statusInputs[i] = 1;
  }

  return (
    <Grid
      templateColumns="repeat(8, 1fr)"
      gap={2}
      padding={0}
      minW={"50%"}
      backgroundColor={"gray.700"}
      borderRadius={10}
      justifyItems={"center"}
    >
      {statusOutputs.map((statusOutput, index) => (
        <GridItem key={index} colSpan={1} rowSpan={1}>
          <BananaSocket
            functionName={statusOutput ? labelsOutputs[index] : "N/A"}
            isOutputProbe={true}
            isActive={statusOutput}
          />
        </GridItem>
      ))}
      {statusInputs.map((statusInput, index) => (
        <GridItem key={index} colSpan={1} rowSpan={1}>
          <BananaSocket
            functionName={statusInput ? labelsInputs[index] : "N/A"}
            isOutputProbe={false}
            isActive={statusInput}
          />
        </GridItem>
      ))}
    </Grid>
  );
}

export default LCPanel;
