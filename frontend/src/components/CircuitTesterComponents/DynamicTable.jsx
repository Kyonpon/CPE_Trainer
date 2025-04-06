import { useEffect, useState } from "react";
import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import PropTypes from "prop-types";

function DynamicTable({
  dynamicTableData = {},
  tableName = "",
  testData = [],
}) {
  const [tableData, setTableData] = useState([]);
  const [rowLenght, setRowLength] = useState(0);

  useEffect(() => {
    if (Object.keys(dynamicTableData).length > 0) {
      const dynamicTableDataKeys = Object.keys(dynamicTableData);
      const firstKeyArr = dynamicTableData[dynamicTableDataKeys[0]];
      const rowLength = firstKeyArr.length;
      const colLength = dynamicTableDataKeys.length;

      setRowLength(dynamicTableDataKeys.length);

      const data = [];
      for (let i = 0; i < rowLength; i++) {
        let row = [];
        for (let j = 0; j < colLength; j++) {
          row.push(dynamicTableData[dynamicTableDataKeys[j]][i]);
        }
        data.push(row);
      }
      console.log("Data:", data);
      setTableData(data);
    }
  }, [dynamicTableData]);

  return (
    <Box bg="white" minH="50" padding={0.5} borderRadius="5">
      <Heading size="md" textAlign="center" bg={"#38256b"} p={1}>
        {tableName}
      </Heading>
      <Grid
        templateColumns={`repeat(${rowLenght}, 1fr)`}
        gap={0.5}
        borderTop={"1px solid rgb(255, 255, 255)"}
      >
        {Object.keys(dynamicTableData).map((key) => (
          <GridItem
            key={key}
            bg="#38256b"
            minH="3em"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Heading size="md">{key}</Heading>
          </GridItem>
        ))}
        {tableData.map((row, indexRow) =>
          row.map((cell, index) => (
            <GridItem
              key={index}
              bg={testData[indexRow] == 1 ? "green.500" : "red.500"}
              minH="2em"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Heading size="md">{cell}</Heading>
            </GridItem>
          ))
        )}
      </Grid>
    </Box>
  );
}

DynamicTable.propTypes = {
  dynamicTableData: PropTypes.object.isRequired,
  tableName: PropTypes.string,
  testData: PropTypes.arrayOf(PropTypes.number),
};

export default DynamicTable;
