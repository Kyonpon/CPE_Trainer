import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { moduleAddBoolFunction, moduleFinalTable } from "../../utils/BoolUtils";
import DynamicTable from "./DynamicTable";
import ResultTT from "./ResultTT";
import ModuleSignals from "./ModuleSignals";
import LCPanel from "./VisualizedPanel/LCPanel";
import { debounce } from "lodash";

function CombiCheckModule({ moduleName, onDeleteModule }) {
  const [instanceTracker, setInstanceTracker] = useState([]);
  const [functionName, setFunctionName] = useState("");
  const [equalVariables, setEqualVariables] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [moduleBoolSolverInstances, setModuleSolverInstances] = useState({});
  const [moduleFinalTableData, setModuleFinalTableData] = useState({});
  const [toBackend, setToBackend] = useState({
    moduleName: moduleName,
    inputs: {},
    outputs: {},
  });
  const [resultGraphData, setResultGraphData] = useState({});

  //#region Wesbocket stuff
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState({});
  const [parsedMessage, setParsedMessage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [socket, setSocket] = useState(null);
  const [resultTable, setResultTable] = useState({
    isPassed: [],
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/circuitchecker");

    ws.onopen = () => {
      console.log("WebSocket is connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parse the JSON string
        setParsedMessage(data); // Store the parsed data
        setMessage(event.data); // Keep the raw message if needed
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket is closed", event);
      // Optionally, attempt to reconnect after a delay
      setTimeout(() => {
        console.log("Reconnecting...");
        setSocket(new WebSocket("ws://localhost:5000/circuitchecker"));
      }, 3000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (parsedMessage) {
      updateResultable(
        parsedMessage[moduleName].isPassed,
        parsedMessage[moduleName].outputsActual
      );
      updateResultGraph(parsedMessage[moduleName].acutalInputsOutputs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedMessage]);

  const updateResultable = (isPassed, outputsActual) => {
    if (!outputsActual) {
      console.warn("outputsActual is undefined or null");
      return;
    }

    setResultTable(outputsActual);

    setResultTable((prev) => ({
      ...prev,
      isPassed: isPassed,
    }));
  };

  const updateResultGraph = (acutalInputsOutputs) => {
    if (!acutalInputsOutputs) {
      console.warn("acutalInputsOutputs is undefined or null");
      return;
    }

    setResultGraphData(acutalInputsOutputs);
  };

  //#endregion

  const handleDisable = useCallback(() => {
    const instances = instanceTracker.length;
    if (instances > 0) {
      setIsDisabled(false);
    }
    if (instances === 0) {
      setIsDisabled(true);
    }
  }, [instanceTracker]);

  useEffect(() => {
    setInstanceTracker(Object.keys(moduleBoolSolverInstances));
  }, [moduleBoolSolverInstances]);

  useEffect(() => {
    handleDisable();
  }, [handleDisable]);

  useEffect(() => {
    const outputs = {};
    const expressionNames = Object.keys(moduleBoolSolverInstances);
    expressionNames.map((expressionName) => {
      outputs[expressionName] =
        moduleBoolSolverInstances[expressionName].ExpressionOutput;
    });
    if (expressionNames.length > 0) {
      const firstInputs =
        moduleBoolSolverInstances[expressionNames[0]].InputsTT;
      setToBackend((prev) => ({ ...prev, inputs: firstInputs }));
    }
    setToBackend((prev) => ({
      ...prev,
      outputs: outputs,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleFinalTableData]);

  const sendToCheck = async (toBackend) => {
    try {
      const response = await axios.post(
        "/api/circuitchecker/getchecktt",
        toBackend
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddExpression = () => {
    const newBooleanExp = moduleAddBoolFunction(
      functionName,
      moduleBoolSolverInstances
    );
    setModuleSolverInstances({
      ...moduleBoolSolverInstances,
      [functionName]: newBooleanExp,
    });
    setFunctionName("");
  };

  //Check Button
  const handleMCU = () => {
    //This checks if all instances have the same number of variables
    const allVariables = {};
    const variableCounts = [];

    for (const instanceName in moduleBoolSolverInstances) {
      const { Variables } = moduleBoolSolverInstances[instanceName];
      allVariables[instanceName] = Variables;
      variableCounts.push(Variables.length);
    }

    // Check if all variable counts are the same
    const uniqueCounts = new Set(variableCounts);
    if (uniqueCounts.size > 1) {
      console.log(
        "Error: Not all instances have the same number of variables."
      );
      setEqualVariables(false);
      return;
    }

    setEqualVariables(true);
    setModuleFinalTableData(moduleFinalTable(moduleBoolSolverInstances));
  };

  const handleSend = () => {
    console.log("ToBackend:", toBackend);
    sendToCheck(toBackend);
  };

  const handleDebug = () => {
    console.log("Debugging module:", moduleName);
    console.log("Instance Tracker:", instanceTracker);
    console.log("functionName:", functionName);
    console.log("Module Bool Solver Instances:", moduleBoolSolverInstances);
    console.log("Module Final Table Data:", moduleFinalTableData);
    console.log("To Backend:", toBackend);
    console.log("Result Table:", resultTable);
    console.log("Result Graph Data:", resultGraphData);
  };

  const handleDeleteModuleBoolExpression = (moduleBoolExpressionName) => {
    if (!moduleBoolExpressionName) {
      return { success: false, message: "Function name cannot be empty" };
    }
    if (!(moduleBoolExpressionName in moduleBoolSolverInstances)) {
      return {
        success: false,
        message: `Function "${moduleBoolExpressionName}" doesn't already exist`,
      };
    }
    const newModuleBoolSolverInstances = { ...moduleBoolSolverInstances };
    delete newModuleBoolSolverInstances[moduleBoolExpressionName];
    setModuleSolverInstances(newModuleBoolSolverInstances);

    return {
      success: true,
      message: `Function "${moduleBoolExpressionName}" removed successfully`,
    };
  };

  const handleDeleteModule = () => {
    onDeleteModule();
  };

  const handleUpdate = (moduleBoolExpressionName, newValues) => {
    setModuleSolverInstances((prevInstances) => ({
      ...prevInstances,
      [moduleBoolExpressionName]: {
        ...newValues,
      },
    }));
  };

  const handleNewFunctionNme = (e) => {
    setFunctionName(e.target.value);
  };

  // eslint-disable-next-line no-unused-vars
  const debouncedEffect = debounce((value) => {
    // Do something with the value, like API call
    //console.log("Debounced input:", value);
  }, 500); // 500ms delay

  useEffect(() => {
    debouncedEffect(functionName);
    return debouncedEffect.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionName]);

  const [graphOn, setGraphOn] = useState(false);
  const handleToggleTable = () => {
    setGraphOn((prev) => !prev);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box p={2} borderRadius={5}>
      <HStack>
        <Input
          w="30%"
          value={functionName}
          onChange={handleNewFunctionNme}
          placeholder="Name the output function of this expression ( eg. f(), Sum, Carry, etc.)"
        ></Input>
        <Button mt={2} onClick={handleAddExpression}>
          Add Another Output
        </Button>
        <Button mt={2} onClick={handleMCU} isDisabled={isDisabled}>
          Create Check Table
        </Button>
        <Button mt={2} onClick={handleDeleteModule}>
          Delete Module
        </Button>
        <Button mt={2} onClick={handleDebug}>
          Debug
        </Button>
      </HStack>

      {instanceTracker.map((instance) => (
        <BoolSolverInstance
          key={instance}
          expressionName={instance}
          moduleBoolSolverInstances={moduleBoolSolverInstances}
          onDeleteInstance={() => handleDeleteModuleBoolExpression(instance)}
          onInput={handleUpdate}
        />
      ))}

      {isDisabled ? (
        <Box />
      ) : (
        <Box>
          {equalVariables ? (
            <Box>
              <HStack mt={2}>
                <Button onClick={handleSend} isDisabled={isDisabled}>
                  Send To Backend
                </Button>
                <Button onClick={handleToggleTable}>Toggle View</Button>
                <Button onClick={onOpen}>Show Panel Assignment</Button>
              </HStack>
              {graphOn ? (
                <Grid templateColumns={"repeat(2, 1fr)"} columnGap={1} mt={2}>
                  <GridItem colSpan={1}>
                    <ModuleSignals
                      signals={moduleFinalTableData}
                    ></ModuleSignals>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <ModuleSignals signals={resultGraphData}></ModuleSignals>
                  </GridItem>
                </Grid>
              ) : (
                <Grid templateColumns={"repeat(3, 1fr)"} columnGap={1} mt={2}>
                  <GridItem colSpan={2}>
                    <DynamicTable
                      dynamicTableData={moduleFinalTableData}
                      tableName={"TEST TABLE"}
                      testData={resultTable.isPassed}
                    ></DynamicTable>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <ResultTT resultTable={resultTable}></ResultTT>{" "}
                  </GridItem>
                </Grid>
              )}

              <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent width="fit-content" minWidth="fit-content">
                  <ModalHeader>Panel Assignment</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody
                    mt={2}
                    backgroundColor={"gray.700"}
                    p={2}
                    borderRadius={5}
                    textAlign={"center"}
                  >
                    <LCPanel
                      outputs={toBackend.outputs}
                      inputs={toBackend.inputs}
                    ></LCPanel>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          ) : (
            <Box
              mt={2}
              border="1px"
              p={2}
              textAlign="center"
              color="orange.500"
            >
              WARNING: NOT ALL INSTANCES HAVE THE SAME NUMBER OF VARIABLES
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

CombiCheckModule.propTypes = {
  moduleName: PropTypes.string.isRequired,
  onDeleteModule: PropTypes.func.isRequired,
};

export default CombiCheckModule;
