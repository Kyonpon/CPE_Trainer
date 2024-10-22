import { create } from "zustand";
import axios from "axios";

export const useULCircuits = create((set) => ({
  ulCircuit: [],
  setUlCircuit: (ulCircuit) => set({ ulCircuit }),

  zustandCreateUlCircuit: async (newULCircuit) => {
    if (!newULCircuit.circuit) {
      return { success: false, message: "Circuit name required!" };
    }
  },
}));
