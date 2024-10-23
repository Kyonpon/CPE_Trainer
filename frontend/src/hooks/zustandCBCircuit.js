import axios from "axios";
import { create } from "zustand";

export const useCBCircuits = create((set) => ({
  combiLogicCircuit: [],
  setCombiLogicCircuit: (combiLogicCircuit) => set({ combiLogicCircuit }),
  createCombiLogicCircuit: async (newCombiLogicCircuit) => {
    if (!newCombiLogicCircuit.combiLogicCircuitName) {
      return { success: false, message: "Please add a circuit name!" };
    }
    try {
      const res = await axios.post(
        "/api/cbcircuits/createcb",
        newCombiLogicCircuit,
        { headers: { "Content-Type": "application/json" } }
      );
      set((state) => ({
        combiLogicCircuit: [...state.combiLogicCircuit, res.data.data],
      }));
      return { success: true, message: "Circuit Created sucessfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },
}));
