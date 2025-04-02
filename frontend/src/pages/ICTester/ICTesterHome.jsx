import React, { useState } from "react";
import TwoInputVizualizer from "../../components/ICTester/TwoInputVizualizer";
import { Box, Button, Heading } from "@chakra-ui/react";

function ICTesterHome() {
  const [pinStatuses, setPinStatuses] = useState([
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ]);

  const gateSet = {
    gate1: [7, 8, 9],
    gate2: [10, 11, 12],
    gate3: [1, 2, 3],
    gate4: [4, 5, 6],
  };

  //[VCC, GATE3A, GATE3B, GATE4Y, GATE4A, GATE4B, GATE4Y,GATE1A, GATE1B, GATE1Y,GATE2A, GATE2B, GATE2Y,]

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

  const handleTestGoodGate2 = () => {
    testGood(gateSet.gate2);
  };

  const handleTestBadGate2 = () => {
    testBad(gateSet.gate2);
  };

  const handleTestGoodGate1 = () => {
    testGood(gateSet.gate1);
  };

  const handleTestBadGate1 = () => {
    testBad(gateSet.gate1);
  };

  const handleTestGoodGate3 = () => {
    testGood(gateSet.gate3);
  };

  const handleTestBadGate3 = () => {
    testBad(gateSet.gate3);
  };

  const handleTestGoodGate4 = () => {
    testGood(gateSet.gate4);
  };

  const handleTestBadGate4 = () => {
    testBad(gateSet.gate4);
  };

  const gatesState = [1, 0, 0, 1];

  const handlGateStatus = () => {
    const quadGateIC = Object.keys(gateSet);
    for (let i = 0; i < gatesState.length; i++) {
      if (gatesState[i] === 0) {
        testBad(gateSet[quadGateIC[i]]);
      }
      if (gatesState[i] === 1) {
        testGood(gateSet[quadGateIC[i]]);
      }
    }
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
      <Box display="flex" justifyContent="center" gap={2}>
        <Box>
          <h1>Gate 1</h1>
          <Button onClick={handleTestGoodGate1}>Test GOOD</Button>
          <Button onClick={handleTestBadGate1}>Test BAD</Button>
        </Box>
        <Box>
          <h1>Gate 2</h1>
          <Button onClick={handleTestGoodGate2}>Test GOOD</Button>
          <Button onClick={handleTestBadGate2}>Test BAD</Button>
        </Box>
        <Box>
          <h1>Gate 3</h1>
          <Button onClick={handleTestGoodGate3}>Test GOOD</Button>
          <Button onClick={handleTestBadGate3}>Test BAD</Button>
        </Box>
        <Box>
          <h1>Gate 4</h1>
          <Button onClick={handleTestGoodGate4}>Test GOOD</Button>
          <Button onClick={handleTestBadGate4}>Test BAD</Button>
        </Box>

        <Box>
          <h1>Testing</h1>
          <Button onClick={handlGateStatus}> Test </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ICTesterHome;
