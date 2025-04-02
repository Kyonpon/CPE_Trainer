let receivedTruthTable = {};

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

let resultTruthTable ={};

// react app > Server
export const getModuleCheckTable = (req, res) => {
  const { moduleName, inputs, outputs } = req.body;

  receivedTruthTable[moduleName] = { inputs, outputs };
  res.status(200).json({ success: true, data: receivedTruthTable });
  console.log(moduleName);
  console.log("receivedTruthTable: ", receivedTruthTable);
};

// Server > ESP32
export const testSend = (req, res) => {
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
  const {moduleName, isPassed, outputsActual} = req.body;
  resultTruthTable[moduleName] = { isPassed, outputsActual };
}