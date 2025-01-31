import { create } from "zustand";
import { generateTable, generateSOP } from "../utils/BoolUtils";

export const useLogicCheck = create((set, get) => ({
  BoolMenuInstances: {}, // Initialize as an empty object
  setBoolMenuInstances: (BoolMenuInstances) => set({ BoolMenuInstances }),

  addBoolFunction: (functionName) => {
    const trimmedFunctionName = functionName.trim().toUpperCase();
    if (!trimmedFunctionName) {
      return { success: false, message: "Function name cannot be empty" };
    }

    // Get the current state
    const currentState = get();

    // Check if the functionName already exists
    if (currentState.BoolMenuInstances[trimmedFunctionName]) {
      return {
        success: false,
        message: `Function "${trimmedFunctionName}" already exists`,
      };
    }

    // Add the new functionName with the default structure
    set((state) => ({
      BoolMenuInstances: {
        ...state.BoolMenuInstances,
        [trimmedFunctionName]: {
          Variables: [],
          InputsTT: {},
          ExpressionOutput: [],
          ExpressionSOP: "",
          FinalTT: {},
        },
      },
    }));

    return {
      success: true,
      message: `Function "${trimmedFunctionName}" added successfully`,
    };
  },
  removeBoolFunction: (functionName) => {
    if (!functionName) {
      return { success: false, message: "Function name cannot be empty" };
    }

    const currentState = get();

    // Check if the functionName exists
    if (!currentState.BoolMenuInstances[functionName]) {
      return {
        success: false,
        message: `Function "${functionName}" does not exist`,
      };
    }

    // Remove the functionName from the state (CORRECTED)
    set((state) => {
      const newBoolMenuInstances = { ...state.BoolMenuInstances }; // Create a copy
      delete newBoolMenuInstances[functionName]; // Delete from the copy
      return { BoolMenuInstances: newBoolMenuInstances }; // Update state with the copy
    });

    return {
      success: true,
      message: `Function "${functionName}" removed successfully`,
    };
  },

  handleInputInstance: (expression, expressionName) => {
    const trimmedFunctionName = expressionName.trim().toUpperCase();
    expression, expressionName;
    let variables = [];
    let solvedMinterms = [];
    let expressionOut = [];

    const handleExpressionChange = (newExpression) => {
      if (!newExpression) {
        variables = [];
        solvedMinterms = [];
        expressionOut = [];
      }

      const uniqueVariables = [
        ...new Set(newExpression.match(/[A-Z]/g)),
      ].sort();
      if (uniqueVariables.length > 8) {
        alert("You can only have up to 8 variables.");
        return;
      }

      const [tableHTML, minTerms, maxTerms, fColumnValues] = generateTable(
        newExpression,
        uniqueVariables
      );

      variables = uniqueVariables;
      expressionOut = fColumnValues;
      solvedMinterms = minTerms;
      //const solvedExpression = generateSOP(solvedMinterms, variables);

      // Generate truth table for the variables
      function generateTruthTable(vars) {
        const n = vars.length; // Number of variables
        const totalCombinations = Math.pow(2, n); // 2^n possible combinations
        const inputsTT = {};

        // Initialize each variable with an empty array
        vars.forEach((variable) => {
          inputsTT[variable] = [];
        });

        for (let i = 0; i < totalCombinations; i++) {
          // For each variable, determine the bit value for that variable in the current combination
          for (let j = 0; j < n; j++) {
            const value = (i >> (n - j - 1)) & 1; // Calculate the bit for the current variable
            inputsTT[vars[j]].push(value);
          }
        }

        return inputsTT;
      }

      const inputsTT = generateTruthTable(variables);
      const FinalTT = {};
      Object.keys(inputsTT).forEach((variable) => {
        FinalTT[variable] = inputsTT[variable];
      });
      FinalTT[expressionName] = expressionOut;
      // console.log("Expression Name:", expressionName);
      // console.log("Unique Variables:", variables);
      // console.log("Inputs Truth Table:", inputsTT);
      // console.log("Expression Output:", expressionOut);
      // console.log("Minterms:", solvedMinterms);
      // console.log("SOP:", solvedExpression);
      // console.log("Final Truth Table:", FinalTT);

      set((state) => ({
        BoolMenuInstances: {
          ...state.BoolMenuInstances,
          [trimmedFunctionName]: {
            Variables: uniqueVariables,
            InputsTT: inputsTT,
            ExpressionOutput: fColumnValues,
            ExpressionSOP: generateSOP(minTerms, uniqueVariables),
            FinalTT: FinalTT,
          },
        },
      }));
    };

    handleExpressionChange(expression);
  },
}));
