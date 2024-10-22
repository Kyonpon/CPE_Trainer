import axios from "axios";
import { create } from "zustand";

export const useUlcircuits = create((set) => ({
  universalLogicCircuit: [],
  setUniversalLogicCircuit: (universalLogicCircuit) =>
    set({ universalLogicCircuit }),
  createUniversalLogicCircuit: async (newUniversalLogicCircuit) => {
    if (!newUniversalLogicCircuit.universalCircuitName) {
      return { success: false, message: "please add a circuit Name!" };
    }
    try {
      const res = await axios.post(
        "/api/ulcircuits/createul",
        newUniversalLogicCircuit,
        { headers: { "Content-Type": "application/json" } }
      );

      set((state) => ({
        universalLogicCircuit: [...state.universalLogicCircuit, res.data.data],
      }));
      return { success: true, message: "Circuit created successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },
}));
