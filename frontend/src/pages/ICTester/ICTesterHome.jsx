import React, { useEffect, useState } from "react";
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

  const gatesState = [1, 0, 0, 1];

  const [wsMessage, setWsMessage] = useState({});
  const [parsedWsMessage, setParsedWsMessage] = useState(null);
  const [ws, setWs] = useState(null);
  const [espResponse, setEspResponse] = useState([]);

  useEffect(() => {
    const wsClient = new WebSocket("ws://localhost:5000/ic-tester");

    wsClient.onopen = () => {
      console.log("WebSocket connection opened");
    };

    wsClient.onmessage = (event) => {
      try {
        const wsParse = JSON.parse(event.data);
        setParsedWsMessage(wsParse);
        setWsMessage(event.data);
        setEspResponse(wsParse.gatesStates);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    wsClient.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsClient.onclose = () => {
      console.log("WebSocket connection closed");
      setTimeout(() => {
        const newWsClient = new WebSocket("ws://localhost:5000/ic-tester");
        setWs(newWsClient);
      }, 1000); // Reconnect after 1 second
    };

    setWs(wsClient);
    return () => {
      wsClient.close();
    };
  }, []);

  const handlGateStatus = () => {
    const quadGateIC = Object.keys(gateSet);
    for (let i = 0; i < espResponse.length; i++) {
      if (espResponse[i] === 0) {
        testBad(gateSet[quadGateIC[i]]);
      }
      if (espResponse[i] === 1) {
        testGood(gateSet[quadGateIC[i]]);
      }
    }
  };

  useEffect(() => {
    console.log("ESP Response:", espResponse);
    if (espResponse && espResponse.length > 0) {
      handlGateStatus();
    }
  }, [espResponse]);

  return (
    <Box>
      <Heading>ICTester</Heading>
      <Box display="flex" justifyContent="center">
        <TwoInputVizualizer
          pinStatuses={pinStatuses}
          setPinStatuses={setPinStatuses}
        ></TwoInputVizualizer>
      </Box>
    </Box>
  );
}

export default ICTesterHome;
