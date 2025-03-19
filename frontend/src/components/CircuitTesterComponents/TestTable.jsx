import React, { useEffect, useState } from "react";
import { Grid, GridItem, Heading } from "@chakra-ui/react";

function TestTable({ finalTable = {} }) {
  const [testData, setTestData] = useState([0, 1, 1, 1]);
  const [tableData, setTableData] = useState([]);
  const [rowLenght, setRowLength] = useState(0);

  useEffect(() => {
    if (Object.keys(finalTable).length > 0) {
      const finalTableKeys = Object.keys(finalTable);
      const firstKeyArr = finalTable[finalTableKeys[0]];
      const rowLength = firstKeyArr.length;
      const colLength = finalTableKeys.length;

      setRowLength(finalTableKeys.length);

      const data = [];
      for (let i = 0; i < rowLength; i++) {
        let row = [];
        for (let j = 0; j < colLength; j++) {
          row.push(finalTable[finalTableKeys[j]][i]);
        }
        data.push(row);
      }
      console.log("Data:", data);
      setTableData(data);
    }
  }, [finalTable]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={1}>
      <GridItem colSpan={2} bg="white" minH="50" padding={0.5} borderRadius="5">
        <Heading size="md" textAlign="center" bg={"#38256b"} p={1}>
          Test Table
        </Heading>
        <Grid
          templateColumns={`repeat(${rowLenght}, 1fr)`}
          gap={0.5}
          borderTop={"1px solid rgb(255, 255, 255)"}
        >
          {Object.keys(finalTable).map((key) => (
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
      </GridItem>
      <GridItem bg="red.400" minH="100px">
        <Heading size="md" textAlign="center">
          Test Results
        </Heading>
      </GridItem>
    </Grid>
  );
}

export default TestTable;
