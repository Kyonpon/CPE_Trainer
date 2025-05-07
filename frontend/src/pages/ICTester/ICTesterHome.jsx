import { useEffect, useState } from "react";
import TwoInputVizualizer from "../../components/ICTester/TwoInputVizualizer";
import { Box, Heading } from "@chakra-ui/react";

function ICTesterHome() {
  const [pinStatuses, setPinStatuses] = useState([
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ]);

  //[VCC, GATE3A, GATE3B, GATE4Y, GATE4A, GATE4B, GATE4Y,GATE1A, GATE1B, GATE1Y,GATE2A, GATE2B, GATE2Y,]

  const testGood = (gate, len) => {
    setPinStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      for (let i = 0; i < len; i++) {
        newStatuses[gate[i]] = 1;
      }
      return newStatuses;
    });
  };

  const testBad = (gate, len) => {
    setPinStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      for (let i = 0; i < len; i++) {
        newStatuses[gate[i]] = 0;
      }
      return newStatuses;
    });
  };

  const [wsMessage, setWsMessage] = useState({});
  const [parsedWsMessage, setParsedWsMessage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [ws, setWs] = useState(null);
  const [icName, setIcName] = useState("74LSXX");
  const [gateStates, setGateStates] = useState([]);

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
        setIcName(wsParse.icName);
        setGateStates(wsParse.gateStates);
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

  useEffect(() => {
    console.log("ESP Response Raw:", wsMessage);
    console.log("ESP Response Parsed:", parsedWsMessage);

    console.log("Gate States:", gateStates);
    console.log("IC Name:", icName);
  }, [wsMessage, parsedWsMessage, gateStates, icName]);

  useEffect(() => {
    const quadGateSet = {
      gate1: [7, 8, 9],
      gate2: [10, 11, 12],
      gate3: [1, 2, 3],
      gate4: [4, 5, 6],
    };

    const triGateSet = {
      gate1: [7, 8, 1, 2],
      gate2: [9, 10, 11, 12],
      gate3: [3, 4, 5, 6],
    };

    const notGateSet = {
      gate1: [7, 8],
      gate2: [9, 10],
      gate3: [11, 12],
      gate4: [1, 2],
      gate5: [3, 4],
      gate6: [5, 6],
    };

    const handleQuadGate = (gateStates, icPins) => {
      if (gateStates.length != 0) {
        let numGate = gateStates.length;

        for (let i = 0; i < numGate; i++) {
          if (gateStates[i] === 1) {
            testGood(quadGateSet[icPins[i]], 4);
          } else if (gateStates[i] === 0) {
            testBad(quadGateSet[icPins[i]], 4);
          }
        }
      }
    };

    const handleTriGate = (gateStates, icPins) => {
      if (gateStates.length != 0) {
        let numGate = gateStates.length;

        for (let i = 0; i < numGate; i++) {
          if (gateStates[i] === 1) {
            testGood(triGateSet[icPins[i]], 4);
          } else if (gateStates[i] === 0) {
            testBad(triGateSet[icPins[i]], 4);
          }
        }
      }
    };

    const handleNotGate = (gateStates, icPins) => {
      if (gateStates.length != 0) {
        let numGate = gateStates.length;

        for (let i = 0; i < numGate; i++) {
          if (gateStates[i] === 1) {
            testGood(notGateSet[icPins[i]], 2);
          } else if (gateStates[i] === 0) {
            testBad(notGateSet[icPins[i]], 2);
          }
        }
      }
    };

    if (gateStates.length > 0) {
      if (gateStates.length === 4) {
        const quadGateIC = Object.keys(quadGateSet);
        handleQuadGate(gateStates, quadGateIC);
      }
      if (gateStates.length === 3) {
        const triGateIC = Object.keys(triGateSet);
        handleTriGate(gateStates, triGateIC);
      }
      if (gateStates.length === 6) {
        const notGateIC = Object.keys(notGateSet);
        handleNotGate(gateStates, notGateIC);
      }
    }
  }, [gateStates]);

  return (
    <Box>
      <Heading>ICTester</Heading>
      <Box display="flex" justifyContent="center">
        <TwoInputVizualizer
          pinStatuses={pinStatuses}
          setPinStatuses={setPinStatuses}
          ICName={icName}
        ></TwoInputVizualizer>
      </Box>
    </Box>
  );
}

export default ICTesterHome;
