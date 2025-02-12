import { create } from "zustand";
import { useLogicCheck } from "../zustandLogicCheck";
import { useFinalTable } from "../zustandFinalTable";

export const useModuleInstances = create((set, get) => ({
  ModuleInstances: {},
  setModuleInstances: (moduleInstances) => set({ moduleInstances }),

  addModule: () => {
    const currentState = get();
    const howManyModules = Object.keys(currentState.ModuleInstances).length;
    const newModuleId = `Module${howManyModules + 1}`;

    // Get references to Zustand states instead of creating new instances
    const logicCheckState = useLogicCheck.getState();
    const finalTableState = useFinalTable.getState();

    set((state) => ({
      ModuleInstances: {
        ...state.ModuleInstances,
        [newModuleId]: {
          BoolSolverInstances: logicCheckState.BoolSolverInstances,
          finalTable: finalTableState.finalTable,
        },
      },
    }));
  },

  removeModule: (moduleName) => {
    if (!moduleName) {
      return { success: false, message: "Module name cannot be empty" };
    }

    const currentState = get();

    if (!currentState.ModuleInstances[moduleName]) {
      return {
        success: false,
        message: `Module "${moduleName}" does not exist`,
      };
    }

    set((state) => {
      const newModuleInstances = { ...state.ModuleInstances };
      delete newModuleInstances[moduleName];
      return { ModuleInstances: newModuleInstances };
    });

    return {
      success: true,
      message: `Module "${moduleName}" removed successfully`,
    };
  },
}));
