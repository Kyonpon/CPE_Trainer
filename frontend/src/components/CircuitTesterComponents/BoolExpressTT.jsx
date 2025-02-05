import {
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const BoolExpressTT = ({ finalTT = {} }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const data = [];
    if (Object.keys(finalTT).length > 0) {
      const finalTTkeys = Object.keys(finalTT);
      const firstKeyArr = finalTT[finalTTkeys[0]];
      const numRows = firstKeyArr.length;

      for (let i = 0; i < numRows; i++) {
        const row = {};
        for (const key in finalTT) {
          row[key] = finalTT[key][i];
        }
        data.push(row);
      }
    }
    setTableData(data);
  }, [finalTT]);

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <TableCaption>Check Table</TableCaption>
        <Thead>
          <Tr>
            {Object.keys(finalTT).map((key) => (
              <Th key={key}>{key}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {Object.keys(finalTT).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

// Define prop types
BoolExpressTT.propTypes = {
  finalTT: PropTypes.object,
};

export default BoolExpressTT;
