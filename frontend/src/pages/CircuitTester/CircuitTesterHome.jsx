import { Box, Button, HStack, Input } from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";
import { useState } from "react";

function CircuitTesterHome() {
  const [expressions, setExpressions] = useState([]);
  const [result, setResult] = useState({});
  const [resultNames, setResultNames] = useState([]);
  const [cacheResultNames, setCacheResultNames] = useState("");

  const handleAddExpression = () => {
    setExpressions([...expressions, ""]);
    setResultNames([...resultNames, cacheResultNames]);
    setCacheResultNames("");
  };

  const handleDeleteExpression = (index) => {
    setExpressions(expressions.filter((_, i) => i !== index)); // Remove the instance
    setResultNames(resultNames.filter((_, i) => i !== index));
  };

  const handleFColumnValuesChange = (index, values) => {
    // Only update the result if the new values are different
    if (JSON.stringify(result[index]) !== JSON.stringify(values)) {
      setResult((prev) => ({ ...prev, [index]: values }));
    }
  };

  return (
    <Box p={2} m={0} w="100vw" backgroundColor="purple.700">
      <h1>BOOLEAN FUNCTION SOLVER</h1>

      {expressions.map((expr, index) => (
        <BoolSolverInstance
          key={index}
          instanceExpression={expr}
          onDeleteInstance={() => handleDeleteExpression(index)}
          onFColumnValuesChange={(values) =>
            handleFColumnValuesChange(index, values)
          }
          expressionName={resultNames[index]}
        />
      ))}

      <HStack>
        <Input
          w="30%"
          value={cacheResultNames}
          onChange={(e) => setCacheResultNames(e.target.value)}
          placeholder="Name the output function of this expression ( eg. f(), Sum, Carry, etc.)"
        ></Input>
        <Button mt={2} onClick={handleAddExpression}>
          Add Another Output
        </Button>
      </HStack>
    </Box>
  );
}

export default CircuitTesterHome;
