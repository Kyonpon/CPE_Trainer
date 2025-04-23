import { Box, Button, Grid, GridItem, HStack, Input } from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PropTypes, { func } from "prop-types";
import { moduleAddBoolFunction, moduleFinalTable } from "../../utils/BoolUtils";
import DynamicTable from "./DynamicTable";
import ResultTT from "./ResultTT";
import ModuleSignals from "./ModuleSignals";
import { set } from "mongoose";

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
  const [message, setMessage] = useState({});
  const [parsedMessage, setParsedMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [resultTable, setResultTable] = useState({
    isPassed: [],
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

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
        setSocket(new WebSocket("ws://localhost:5000"));
      }, 3000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  //TO DO: Make this dynamic and not hardcoded
  useEffect(() => {
    if (parsedMessage) {
      updateResultable(
        parsedMessage.Module1?.isPassed,
        parsedMessage.Module1?.outputsActual
      );
      updateResultGraph(parsedMessage.Module1?.acutalInputsOutputs);
      console.log(
        "Parsed message:",
        parsedMessage.Module1?.acutalInputsOutputs
      );
    }
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

  //Debug Button
  const handleCheck = () => {
    console.log("Module Boolean instances:", moduleBoolSolverInstances);
    console.log("Instance Tracker:", instanceTracker);
    console.log(
      "Module Final Table: ",
      moduleFinalTable(moduleBoolSolverInstances)
    );
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
  return (
    <Box p={2} borderRadius={5}>
      {/* <h1>{moduleName}</h1> */}
      <HStack>
        <Input
          w="30%"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
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
        <Button mt={2} onClick={handleCheck}>
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
        // Show "Instances are disabled" warning if isDisabled is true
        // <Box mt={2} border="1px" p={2} textAlign="center" color="red.500">
        //   WARNING: INSTANCES ARE DISABLED
        // </Box>
        <Box></Box>
      ) : (
        // If isDisabled is false, check equalVariables
        <>
          {equalVariables ? (
            // Show the table if equalVariables is true
            <>
              {/* {console.log("moduleFinalTableData:", moduleFinalTableData)} */}
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
              <Grid templateColumns={"repeat(2, 1fr)"} columnGap={1} mt={2}>
                <GridItem colSpan={1}>
                  <ModuleSignals signals={moduleFinalTableData}></ModuleSignals>
                </GridItem>
                <GridItem colSpan={1}>
                  <ModuleSignals signals={resultGraphData}></ModuleSignals>
                </GridItem>
              </Grid>

              <Button mt={2} onClick={handleSend} isDisabled={isDisabled}>
                Send To Backend
              </Button>
            </>
          ) : (
            // Show "NOT ALL INSTANCES HAVE THE SAME NUMBER OF VARIABLES" warning if equalVariables is false
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
        </>
      )}
    </Box>
  );
}

CombiCheckModule.propTypes = {
  moduleName: PropTypes.string.isRequired,
  onDeleteModule: PropTypes.func.isRequired,
};

export default CombiCheckModule;
