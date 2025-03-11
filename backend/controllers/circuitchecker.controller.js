let receivedTruthTable = {};

export const getModuleCheckTable = (req, res) => {
  const moduleCheckTable = req.body;
  const moduleName = moduleCheckTable.moduleName;
  const inputsOutputs = moduleCheckTable.inputsOutputs;
  if (Object.keys(receivedTruthTable).includes(moduleName)) {
    console.log("exisiting");
    receivedTruthTable[moduleName] = inputsOutputs;
  }
  if (!Object.keys(receivedTruthTable).includes(moduleName)) {
    console.log("non-existent");
    receivedTruthTable[moduleName] = inputsOutputs;
  }
  res.status(200).json({ success: true, data: moduleCheckTable });
  console.log(moduleName);
  console.log("receivedTruthTable: ", receivedTruthTable);
};

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
