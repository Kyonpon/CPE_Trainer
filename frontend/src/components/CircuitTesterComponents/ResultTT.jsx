import { useEffect, useState } from "react";
import DynamicTable from "./DynamicTable";

function ResultTT() {
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState({});
  const [parsedMessage, setParsedMessage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [socket, setSocket] = useState(null);
  const [resultTable, setResultTable] = useState({
    isPassed: [],
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("WebSocket is connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parse the JSON string
        setParsedMessage(data); // Store the parsed data
        setMessage(event.data); // Keep the raw message if needed
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket is closed", event);
      // Optionally, attempt to reconnect after a delay
      setTimeout(() => {
        console.log("Reconnecting...");
        setSocket(new WebSocket("ws://localhost:5000"));
      }, 3000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);


  //TO DO: Make this dynamic and not hardcoded
  useEffect(() => {
    if (parsedMessage) {
      updateResultable(
        parsedMessage.Module1?.isPassed,
        parsedMessage.Module1?.outputsActual
      );
    }
  }, [parsedMessage]);

  const updateResultable = (isPassed, outputsActual) => {
    Object.keys(outputsActual).forEach((key) => {
      setResultTable((prev) => ({
        ...prev,
        [key]: outputsActual[key],
      }));
    });

    setResultTable((prev) => ({
      ...prev,
      isPassed: isPassed,
    }));
  };

  useEffect(() => {
    console.log("Result Table:", resultTable);
  }, [resultTable]);

  return (
    <div>
      <h1>Result Test Table</h1>
      <DynamicTable
        dynamicTableData={resultTable}
        tableName={"Result Table"}
        testData={resultTable.isPassed} // Example test data, replace with actual data
      ></DynamicTable>
    </div>
  );
}

export default ResultTT;
