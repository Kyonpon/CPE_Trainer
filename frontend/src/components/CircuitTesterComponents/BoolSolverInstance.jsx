import { Box, Heading, HStack, Input, VStack } from "@chakra-ui/react";
import BoolSOP from "./BoolSOP";
import BoolExpressTT from "./BoolExpressTT";
//import BoolKmap from "./BoolKmap";
import { generateTable } from "../../utils/BoolUtils";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function BoolSolverInstance({
  onDeleteInstance,
  onFColumnValuesChange,
  expressionName,
}) {
  const [expression, setExpression] = useState("");
  const [variables, setVariables] = useState([]);
  const [tableData, setTableData] = useState({});

  useEffect(() => {
    if (tableData.fColumnValues) {
      onFColumnValuesChange(tableData.fColumnValues);
    }
  }, [onFColumnValuesChange, tableData.fColumnValues]);

  const handleInputChange = (e) => {
    handleExpressionChange(e.target.value.trim().toUpperCase());
  };

  const handleExpressionChange = (newExpression) => {
    setExpression(newExpression);
    if (!newExpression) {
      setVariables([]);
      setTableData({});
      return;
    }

    const uniqueVariables = [...new Set(newExpression.match(/[A-Z]/g))].sort();
    if (uniqueVariables.length > 8) {
      alert("You can only have up to 8 variables.");
      return;
    }

    const [tableHTML, minTerms, maxTerms, fColumnValues] = generateTable(
      newExpression,
      uniqueVariables
    );
    setVariables(uniqueVariables);
    setTableData({ tableHTML, minTerms, maxTerms, fColumnValues });
  };

  const handleExpressionDelete = () => {
    onDeleteInstance();
  };

  return (
    <Box m={0} p={0}>
      <VStack spacing={1}>
        <Heading size="lg" textAlign="left" width="100%" ml="1%">
          {expressionName}
        </Heading>
        <Box display="grid" gridTemplateColumns="1fr 1fr .3fr" gap={1} w="100%">
          <Box
            p={4}
            m={0}
            backgroundColor="gray"
            display="flex"
            flexDirection="column"
          >
            <Input
              placeholder="Example Format: (AB)' + AB'C + A'"
              type="text"
              autoComplete="off"
              spellCheck="false"
              value={expression}
              onChange={handleInputChange}
            ></Input>
          </Box>
          <Box
            p={4}
            m={0}
            backgroundColor="gray"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {!expression ? (
              <Heading size="md" textAlign="center">
                Enter a Logic/Boolean Function
              </Heading>
            ) : (
              <BoolSOP variables={variables} minTerms={tableData.minTerms} />
            )}
          </Box>
          <Box
            p={4}
            m={0}
            backgroundColor="red.500"
            borderRadius="10px"
            display="flex"
            flexDirection="column"
            alignContent="center"
            justifyContent="center"
            onClick={() => handleExpressionDelete(console.log("Delete"))}
          >
            <Heading size="md" textAlign="center">
              Delete
            </Heading>
          </Box>
        </Box>

        <HStack justify="space-evenly" spacing={1} w="100%">
          <Box flex="1">
            <BoolExpressTT
              variables={variables}
              tableData={tableData}
            ></BoolExpressTT>
          </Box>
          <Box flex="1">
            {/* <BoolKmap variables={variables} minTerms={tableData.minTerms} /> */}
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}

BoolSolverInstance.propTypes = {
  instanceExpression: PropTypes.string.isRequired,
  onDeleteInstance: PropTypes.func.isRequired,
  onFColumnValuesChange: PropTypes.func,
  expressionName: PropTypes.string.isRequired,
};

export default BoolSolverInstance;
