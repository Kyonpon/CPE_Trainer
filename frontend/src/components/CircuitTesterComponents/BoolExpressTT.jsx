import {
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const BoolExpressTT = ({ variables = [], tableData = {} }) => {
  // Return null or a loading message if no table data is present
  if (!variables.length) {
    return <div></div>; // Show loading or nothing while data is empty
  }

  // Generate truth table with the variables
  function generateTruthTable(vars) {
    const n = vars.length; // Number of variables
    const totalCombinations = Math.pow(2, n); // 2^n possible combinations
    const truthTable = {};

    // Initialize each variable with an empty array
    vars.forEach((variable) => {
      truthTable[variable] = [];
    });

    for (let i = 0; i < totalCombinations; i++) {
      // For each variable, determine the bit value for that variable in the current combination
      for (let j = 0; j < n; j++) {
        const value = (i >> (n - j - 1)) & 1; // Calculate the bit for the current variable
        truthTable[vars[j]].push(value);
      }
    }

    return truthTable;
  }

  const inputsTT = generateTruthTable(variables);
  //console.log("inputsTT", inputsTT);
  // This is the Function Output
  const output = tableData.fColumnValues || [];
  // console.log("F()", output);
  const truthTableWithF = {};

  // Add all variables from inputsTT
  Object.keys(inputsTT).forEach((variable) => {
    truthTableWithF[variable] = inputsTT[variable];
  });

  //This just keyed the "F()" to the ouput array
  truthTableWithF["F()"] = output;
  // console.log("Complete Object", truthTableWithF);

  //Table Header Array
  const columns = [...variables, "F()"];

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <TableCaption>Truth Table with F() column values</TableCaption>
        <Thead>
          <Tr>
            {columns.map((colName) => (
              <Th key={colName}>{colName}</Th> // Header for each column (including F())
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Array.from({ length: output.length }).map((_, rowIndex) => (
            <Tr key={rowIndex}>
              {variables.map((variable, colIndex) => (
                <Td key={colIndex}>
                  {truthTableWithF[variable] &&
                  truthTableWithF[variable][rowIndex] !== undefined
                    ? truthTableWithF[variable][rowIndex]
                    : "N/A"}
                </Td>
              ))}
              {/* Render the F() column */}
              <Td key="fColumn">{truthTableWithF["F()"][rowIndex]}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

// Define prop types
BoolExpressTT.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.shape({
    fColumnValues: PropTypes.array, // Array that should hold the 'fColumnValues' data
  }).isRequired,
};

export default BoolExpressTT;
