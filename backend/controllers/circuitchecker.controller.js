import { broadcastToClients } from "../server.js";

let receivedTruthTable = {};
let resultTruthTable = {};
//Sample return data from esp 32
// let resultTruthTable = {
//   modulename1: {
//     isPassed: [1,1,1,1],
//     outputsActual:{
//       fn1: [1,0,1,0],
//       fn2: [1,1,1,1,1],
//     }
//   },
//   modulename2: {
//     isPassed: [0,0,0,0],
//     outputsActual:{
//       fn1: [1,0,1,0],
//       fn2: [1,1,1,1],
//     }
//   }
// };

// react app > Server
export const getModuleCheckTable = (req, res) => {
  const { moduleName, inputs, outputs } = req.body;

  receivedTruthTable[moduleName] = { inputs, outputs };
  res.status(200).json({ success: true, data: receivedTruthTable });
  //console.log(moduleName);
  //console.log("receivedTruthTable: ", receivedTruthTable);
};

// Server > ESP32
export const sendTestData = (req, res) => {
  const { modulename } = req.params;

  if (!Object.keys(receivedTruthTable).includes(modulename)) {
    return res.json({
      Error: "Invalid API endpoint does not exists!",
      Code: 200,
    });
  }
  const processedTruthTable = receivedTruthTable[modulename];
  //console.log(processedTruthTable);
  res.json(processedTruthTable);
};

//#region UPDATE THIS IT'S NOT COMPATIBLE WITH THE FRONTEND
// ESP32 > Server
export const getTestResults = (req, res) => {
  const { moduleName } = req.params;
  console.log("Module Name: ", moduleName);
  try {
    const { isPassed, outputsActual } = req.body;

    if (!moduleName || !isPassed || !outputsActual) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const acutalInputsOutputs = {
      ...receivedTruthTable[moduleName].inputs,
      ...outputsActual,
    };

    //console.log("acutalInputsOutputs: ", acutalInputsOutputs);

    proxy[moduleName] = { isPassed, outputsActual, acutalInputsOutputs };
    console.log("Sent to Frontend: ")
    res.json({ success: true, data: proxy.moduleName });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// SERVER > React App
const handler = {
  set(target, key, value) {
    target[key] = value;
    //console.log("Updated target: ", target);
    broadcastToClients(target);
    return true;
  },
};
const proxy = new Proxy(resultTruthTable, handler);

//DEBUGS

const randomResultGenerator = (moduleName) => {
  let randomResult = {
    isPassed: [],
    acutalInputsOutputs: {},
    outputsActual: {},
  };

  if (Object.keys(receivedTruthTable).length === 0) {
    console.log("No received truth table data available.");
    return randomResult;
  }
  if (!Object.keys(receivedTruthTable).includes(moduleName)) {
    console.log("Module name not found in received truth table.");
    return randomResult;
  }

  const receivedOutputKeys = Object.keys(
    receivedTruthTable[moduleName].outputs
  );

  const receivedInputKeys = Object.keys(receivedTruthTable[moduleName].inputs);

  const lenght =
    receivedTruthTable[moduleName].outputs[receivedOutputKeys[0]].length;

  receivedInputKeys.forEach((key) => {
    randomResult.acutalInputsOutputs[key] =
      receivedTruthTable[moduleName].inputs[key];
  });

  // Initialize the acutalInputsOutputs object with empty arrays for each key
  receivedOutputKeys.forEach((key) => {
    randomResult.acutalInputsOutputs[key] = [];
    randomResult.outputsActual[key] = [];
  });
  // Generate random values for isPassed and outputsActuals
  for (let i = 0; i < lenght; i++) {
    randomResult.isPassed.push(Math.floor(Math.random() * 2)); // Random 0 or 1
    receivedOutputKeys.forEach((key) => {
      randomResult.acutalInputsOutputs[key].push(Math.floor(Math.random() * 2)); // Random 0 or 1
    });
    receivedOutputKeys.forEach((key) => {
      randomResult.outputsActual[key].push(Math.floor(Math.random() * 2)); // Random 0 or 1
    });
  }
  return randomResult;
};
const testRefereshValues = () => {
  const randomResult1 = randomResultGenerator("Module1");
  const randomResult2 = randomResultGenerator("Module2");
  proxy.Module1 = randomResult1;
  proxy.Module2 = randomResult2;
  console.log("Random Result TT: ", resultTruthTable);
  console.log("Received Truth Table: ", receivedTruthTable);
};
//const refresh = setInterval(testRefereshValues, 1500);
//const refresh = setInterval(randomResultGenerator, 2000);
