import React, { useState } from "react";
import TwoInputVizualizer from "../../components/ICTester/TwoInputVizualizer";
import { Box, Button, Heading } from "@chakra-ui/react";

function ICTesterHome() {
  const [pinStatuses, setPinStatuses] = useState([
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ]);
  const gate4 = [1, 2, 3];
  const gate3 = [4, 5, 6];
  const gate2 = [7, 8, 9];
  const gate1 = [10, 11, 12];
  //[VCC, GATE4A, GATE4B, GATE4Y, GATE3A, GATE3B, GATE3Y,GATE1A, GATE1B, GATE1Y,GATE2A, GATE2B, GATE2Y,]

  const testGood = (gate) => {
    setPinStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      for (let i = 0; i < 3; i++) {
        newStatuses[gate[i]] = 1;
      }
      return newStatuses;
    });
  };

  const testBad = (gate) => {
    setPinStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      for (let i = 0; i < 3; i++) {
        newStatuses[gate[i]] = 0;
      }
      return newStatuses;
    });
  };

  const handleTestG = () => {
    testGood(gate4);
    testGood(gate3);
    testGood(gate2);
    testGood(gate1);
  };

  const handleTestB = () => {
    testBad(gate4);
    testBad(gate3);
    testBad(gate2);
    testBad(gate1);
  };

  return (
    <Box>
      <Heading>ICTester</Heading>
      <Box display="flex" justifyContent="center">
        <TwoInputVizualizer
          pinStatuses={pinStatuses}
          setPinStatuses={setPinStatuses}
        ></TwoInputVizualizer>
      </Box>
      <Button onClick={handleTestG}>Test GOOD</Button>
      <Button onClick={handleTestB}>Test BAD</Button>
    </Box>
  );
}

export default ICTesterHome;
