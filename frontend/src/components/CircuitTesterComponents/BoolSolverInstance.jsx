import { Box, HStack, VStack } from "@chakra-ui/react";
import BoolExpressInput from "./BoolExpressInput";
import BoolSOP from "./BoolSOP";
import BoolExpressTT from "./BoolExpressTT";
//import BoolKmap from "./BoolKmap";
import { generateTable } from "../../utils/BoolUtils";
import { useState } from "react";

function BoolSolverInstance() {
  const [expression, setExpression] = useState("");
  const [variables, setVariables] = useState([]);
  const [tableData, setTableData] = useState({});

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

  return (
    <Box m={0} p={0}>
      <VStack spacing={1}>
        <HStack justify="space-evenly" spacing={1} w="100%">
          <Box flex="1">
            <BoolExpressInput
              expression={expression}
              onExpressionChange={handleExpressionChange}
            ></BoolExpressInput>
          </Box>
          <Box flex="1">
            <BoolSOP variables={variables} minTerms={tableData.minTerms} />
          </Box>
        </HStack>

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

export default BoolSolverInstance;
