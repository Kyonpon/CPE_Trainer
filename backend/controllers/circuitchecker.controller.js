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
  console.log(moduleName);
  console.log("receivedTruthTable: ", receivedTruthTable);
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
  console.log(processedTruthTable);
  res.json(processedTruthTable);
};

// ESP32 > Server
export const getTestResults = (req, res) => {
  const { moduleName } = req.params;
  console.log("Mopdule Name: ", moduleName);
  try {
    const { isPassed, outputsActual } = req.body;

    if (!moduleName || !isPassed || !outputsActual) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    proxy[moduleName] = { isPassed, outputsActual };
    res.json({ success: true, data: proxy.moduleName });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// SERVER > React App
export const getTestResultsRandom = (req, res) => {
  const { moduleName } = req.params;
  const randomResult = randomResultGenerator();
  proxy.moduleName = randomResult;
  res.json(randomResult);
  console.log(resultTruthTable);
};

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

const randomResultGenerator = () => {
  let randomResult = {
    isPassed: [],
    acutalInputsOutputs: {},
    outputsActual: {},
  };

  if (Object.keys(receivedTruthTable).length === 0) {
    console.log("No received truth table data available.");
    return randomResult;
  }
  const receivedOutputKeys = Object.keys(receivedTruthTable.Module1.outputs); //THIS IS STATIC
  const receivedInputKeys = Object.keys(receivedTruthTable.Module1.inputs); //THIS IS STATIC
  const lenght =
    receivedTruthTable.Module1.outputs[receivedOutputKeys[0]].length; //THIS IS STATIC

  receivedInputKeys.forEach((key) => {
    randomResult.acutalInputsOutputs[key] =
      receivedTruthTable.Module1.inputs[key];
  });

  // Initialize the acutalInputsOutputs object with empty arrays for each key
  receivedOutputKeys.forEach((key) => {
    randomResult.acutalInputsOutputs[key] = [];
    randomResult.outputsActual[key] = [];
  });
  // Generate random values for isPassed and outputsActual
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
  const randomResult = randomResultGenerator();
  proxy.Module1 = randomResult;
  //console.log(resultTruthTable);
};
const refresh = setInterval(testRefereshValues, 2000);
//const refresh = setInterval(randomResultGenerator, 2000);
