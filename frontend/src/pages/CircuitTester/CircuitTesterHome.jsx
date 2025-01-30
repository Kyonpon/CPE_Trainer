import { Box, Button, HStack, Input } from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";
import { useEffect, useState } from "react";
import { useLogicCheck } from "../../hooks/zustandLogicCheck";

function CircuitTesterHome() {
  const [instanceTracker, setInstanceTracker] = useState([]);
  const [functionName, setFunctionName] = useState("");
  const { addBoolFunction, removeBoolFunction, BoolMenuInstances } =
    useLogicCheck();

  useEffect(() => {
    setInstanceTracker(Object.keys(BoolMenuInstances));
  }, [BoolMenuInstances]);

  const handleAddExpression = () => {
    addBoolFunction(functionName);
    setFunctionName("");
  };

  const handleCheck = () => {
    console.log("Zustand instances:", BoolMenuInstances);
    console.log("Instance Tracker:", instanceTracker);
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
        <Button mt={2} onClick={handleCheck}></Button>
      </HStack>
    </Box>
  );
}

export default CircuitTesterHome;
