import React, { useEffect, useState } from "react";

function ResultTT() {
  const [message, setMessage] = useState({});
  const [parsedMessage, setParsedMessage] = useState(null);
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

  useEffect(() => {
    if (parsedMessage) {
      updateResultable(
        parsedMessage.module1?.isPassed,
        parsedMessage.module1?.outputsActual
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
      {parsedMessage && (
        <div>
          <h2>Module 1</h2>
          <p>isPassed: {JSON.stringify(parsedMessage.module1?.isPassed)}</p>
          <p>
            outputsActual:{" "}
            {JSON.stringify(parsedMessage.module1?.outputsActual)}
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultTT;
