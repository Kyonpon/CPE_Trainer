import { Box, Button, HStack, Input } from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";
import { useCallback, useEffect, useState } from "react";
import { useLogicCheck } from "../../hooks/zustandLogicCheck";
import BoolCheckTable from "../../components/CircuitTesterComponents/BoolCheckTable";
import { useFinalTable } from "../../hooks/zustandFinalTable";

function CircuitTesterHome() {
  const [instanceTracker, setInstanceTracker] = useState([]);
  const [functionName, setFunctionName] = useState("");
  const [equalVariables, setEqualVariables] = useState();
  const { addBoolFunction, removeBoolFunction, BoolSolverInstances } =
    useLogicCheck();
  const { createFinalTable, finalTable } = useFinalTable();

  const [isDisabled, setIsDisabled] = useState(true);

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
    setInstanceTracker(Object.keys(BoolSolverInstances));
  }, [BoolSolverInstances]);

  useEffect(() => {
    handleDisable();
  }, [handleDisable]);

  const handleAddExpression = () => {
    addBoolFunction(functionName);
    setFunctionName("");
  };

  //Check Button
  const handleMCU = () => {
    //This checks if all instances have the same number of variables
    const allVariables = {};
    const variableCounts = [];

    for (const instanceName in BoolSolverInstances) {
      const { Variables } = BoolSolverInstances[instanceName];
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
    createFinalTable(BoolSolverInstances);
  };

  //Debug Button
  const handleCheck = () => {
    console.log("Zustand instances:", BoolSolverInstances);
    console.log("Instance Tracker:", instanceTracker);
    console.log("Zustand final table:", finalTable);
  };

  return (
    <Box p={2} m={0} w="100vw" backgroundColor="purple.700">
      <h1>BOOLEAN FUNCTION SOLVER</h1>
      {instanceTracker.map((instance) => (
        <BoolSolverInstance
          key={instance}
          expressionName={instance}
          onDeleteInstance={() => removeBoolFunction(instance)}
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
              <BoolCheckTable></BoolCheckTable>
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

export default CircuitTesterHome;
