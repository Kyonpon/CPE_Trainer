import { create } from "zustand";

export const useFinalTable = create((set) => ({
  finalTable: {},
  setfinalTable: (finalTable) => set({ finalTable }),

  createFinalTable: (boolMenusInstances = {}) => {
    if (!boolMenusInstances) {
      return {
        success: false,
        message: "Inputs and expressions cannot be empty",
      };
    }

    if (Object.keys(boolMenusInstances).length == 0) {
      return console.log("No Instances provided. Ignoring boolean menus.");
    }

    const firstFunctionName = Object.keys(boolMenusInstances)[0];
    const firstFunctionObject = boolMenusInstances[firstFunctionName];
    const firstFunctionVariables = firstFunctionObject.InputsTT;

    const expressionNamesAndOutput = {};
    Object.keys(boolMenusInstances).forEach((functionName) => {
      expressionNamesAndOutput[functionName] =
        boolMenusInstances[functionName].ExpressionOutput;
    });

    const CfinalTable = {
      ...firstFunctionVariables,
      ...expressionNamesAndOutput,
    };

    //console.log("First Function Name Variables:", firstFunctionVariables);
    set({ finalTable: CfinalTable });
  },
}));
