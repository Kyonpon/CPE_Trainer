import { useEffect, useState } from "react";
import DynamicTable from "./DynamicTable";

function ResultTT({ resultTable }) {
  return (
    <DynamicTable
      dynamicTableData={resultTable}
      tableName={"Result Table"}
      testData={resultTable.isPassed} // Example test data, replace with actual data
    ></DynamicTable>
  );
}

export default ResultTT;
