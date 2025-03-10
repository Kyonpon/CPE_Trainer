import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function BoolCheckTable({ finalTable = {} }) {
  //const headings = Object.keys(finalTable);
  //const firstKey = Object.keys(finalTable)[0];
  //const rowLenght = finalTable[firstKey].length;

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const data = [];
    if (Object.keys(finalTable).length > 0) {
      const finalTTkeys = Object.keys(finalTable);
      const firstKeyArr = finalTable[finalTTkeys[0]];
      const numRows = firstKeyArr.length; // Assuming all arrays have the same length
      for (let i = 0; i < numRows; i++) {
        const row = {};
        for (const key in finalTable) {
          row[key] = finalTable[key][i];
        }
        data.push(row);
      }
    }
    setTableData(data);
  }, [finalTable]);

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            {Object.keys(finalTable).map((key) => (
              <Th key={key}>{key}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {Object.keys(finalTable).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default BoolCheckTable;
