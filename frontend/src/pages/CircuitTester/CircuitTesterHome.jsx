import { Box, Button, HStack, Input } from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";
import { useCallback, useEffect, useState } from "react";

function CircuitTesterHome() {
  const [expressions, setExpressions] = useState([]);
  const [result, setResult] = useState({});
  const [resultNames, setResultNames] = useState([]);
  const [cacheResultNames, setCacheResultNames] = useState("");
  const [resultWithNames, setResultWithNames] = useState({});
  const [namesWithVariables, setNamesWithVariables] = useState({});

  useEffect(() => {
    const newObject = {};

    resultNames.forEach((name, index) => {
      newObject[name] = result[index] || []; // Assign the corresponding result or an empty array
    });

    setResultWithNames(newObject);
  }, [resultNames, result]);

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

  const handleOnvariablesChange = useCallback((index, variables) => {
    setNamesWithVariables((prev) => ({
      ...prev,
      [index]: variables, // Update only the relevant index
    }));
  }, []);

  const handleCheck = () => {
    console.log("Results with names:", resultWithNames);
    console.log("Names with variables:", namesWithVariables);
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
          onVariablesChange={(variables) =>
            handleOnvariablesChange(index, variables)
          }
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
        <Button mt={2} onClick={handleCheck}></Button>
      </HStack>
    </Box>
  );
}

export default CircuitTesterHome;
