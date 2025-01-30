import { create } from "zustand";
import { generateTable, generateSOP } from "../utils/BoolUtils";

export const useLogicCheck = create((set, get) => ({
  BoolMenuInstances: {}, // Initialize as an empty object
  setBoolMenuInstances: (BoolMenuInstances) => set({ BoolMenuInstances }),

  addBoolFunction: (functionName) => {
    if (!functionName) {
      return { success: false, message: "Function name cannot be empty" };
    }

    // Get the current state
    const currentState = get();

    // Check if the functionName already exists
    if (currentState.BoolMenuInstances[functionName]) {
      return {
        success: false,
        message: `Function "${functionName}" already exists`,
      };
    }

    // Add the new functionName with the default structure
    set((state) => ({
      BoolMenuInstances: {
        ...state.BoolMenuInstances,
        [functionName]: {
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
      message: `Function "${functionName}" added successfully`,
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
}));
