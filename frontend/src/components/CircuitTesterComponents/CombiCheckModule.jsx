import { Box, Button, HStack, Input } from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";
import { useCallback, useEffect, useState } from "react";
import BoolCheckTable from "../../components/CircuitTesterComponents/BoolCheckTable";
import axios from "axios";
import PropTypes, { func } from "prop-types";
import { moduleAddBoolFunction, moduleFinalTable } from "../../utils/BoolUtils";

function CombiCheckModule({ moduleName, onDeleteModule }) {
  const [instanceTracker, setInstanceTracker] = useState([]);
  const [functionName, setFunctionName] = useState("");
  const [equalVariables, setEqualVariables] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [moduleBoolSolverInstances, setModuleSolverInstances] = useState({});
  const [moduleFinalTableData, setModuleFinalTableData] = useState({});
  const [toBackend, setToBackend] = useState({
    moduleName: moduleName,
    inputsOutputs: {},
  });

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
    console.log("Updated moduleFinalTableData:", moduleFinalTableData);
    setToBackend((prev) => ({
      ...prev,
      inputsOutputs: moduleFinalTableData,
    }));
  }, [moduleFinalTableData]);

  const sendToCheck = async (toBackend) => {
    try {
      const response = await axios.post(
        "/api/circuitchecker/getchecktt",
        toBackend
      );
      console.log("runned");
      console.log(response.data);
    } catch (error) {}
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
    sendToCheck(moduleFinalTableData);
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
    <Box p={2} mb={5} w="100vw" backgroundColor="purple.700">
      <h1>{moduleName}</h1>
      {instanceTracker.map((instance) => (
        <BoolSolverInstance
          key={instance}
          expressionName={instance}
          moduleBoolSolverInstances={moduleBoolSolverInstances}
          onDeleteInstance={() => handleDeleteModuleBoolExpression(instance)}
          onInput={handleUpdate}
        />
      ))}
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
      {isDisabled ? (
        // Show "Instances are disabled" warning if isDisabled is true
        <Box mt={2} border="1px" p={2} textAlign="center" color="red.500">
          WARNING: INSTANCES ARE DISABLED
        </Box>
      ) : (
        // If isDisabled is false, check equalVariables
        <>
          {equalVariables ? (
            // Show the table if equalVariables is true
            <>
              <Box mt={2} border="1px" p={2} textAlign="center">
                THIS IS THE TABLE
              </Box>
              <BoolCheckTable
                finalTable={moduleFinalTableData}
              ></BoolCheckTable>
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
