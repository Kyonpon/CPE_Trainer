import axios from "axios";
import { create } from "zustand";

export const useULCircuits = create((set) => ({
  universalLogicCircuit: [],
  setUniversalLogicCircuit: (universalLogicCircuit) =>
    set({ universalLogicCircuit }),

  createUniversalLogicCircuit: async (newUniversalLogicCircuit) => {
    if (!newUniversalLogicCircuit.circuitName) {
      return { success: false, message: "Please add a circuit name!" };
    }
    try {
      const response = await axios.post(
        "api/ulcircuits/createul",
        newUniversalLogicCircuit,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      set((state) => ({
        universalLogicCircuit: [
          ...state.universalLogicCircuit,
          response.data.data,
        ],
      }));
      return { success: true, message: "Circuit Created sucessfully" };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error creating new universal logicciircuit occurred",
      };
    }
  },

  fetchUniversalLogicCircuit: async () => {
    try {
      const response = await axios.get("api/ulcircuits/getall");
      set({ universalLogicCircuit: response.data.circuits });
    } catch (error) {
      console.log("Error Fetching universal logic circuits:", error);
    }
  },

  fetchSingleCircuit: async (id) => {
    if (!id) {
      console.log("No ID provided to fetch a UL circuit");
      return null;
    }
    try {
      const response = await axios.get(`api/ulcircuits/getbyid/${id}`);
      return response.data.circuit;
    } catch (error) {
      console.log("Error Fetching this ID in universal logic circuits:", error);
      return null;
    }
  },

  deleteSingleContent: async (circuitid, contentid) => {
    if (!contentid) {
      console.log("No ID provided to delete a Content");
      return null;
    }
    if (!circuitid) {
      console.log("No Circuit ID provided to delete a Content");
      return null;
    }
    try {
      const response = await axios.delete(
        `/api/ulcircuits/delete/${circuitid}/${contentid}`
      );
      return response.data.circuit;
    } catch (error) {
      console.error(
        "Error Deleting this ID in universal logic circuits:",
        error
      );
    }
    return null;
  },

  updateContent: async (circuitid, contentid, updatedContent) => {
    if (!contentid) {
      console.log("No ID provided to update a Content");
      return null;
    }
    if (!circuitid) {
      console.log("No Circuit ID provided to update a Content");
      return null;
    }
    try {
      const response = await axios.put(
        `/api/ulcircuits/update/${circuitid}`,
        updatedContent,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred in updating the content",
      };
    }
  },

  updateAddContent: async (circuitid, type, updateAddContent) => {
    const validTypes = ["Text", "Image", "TextAndImage"];
    if (!validTypes.includes(type)) {
      console.log("The Type provided is invalid");
      return null;
    }
    try {
      const res = await axios.put(
        `/api/ulcircuits/addcontent/${circuitid}`,
        updateAddContent,
        { headers: { "Content-Type": "application/json" } }
      );
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data.message || "An error in adding new content",
      };
    }
  },

  deleteCircuit: async (circuitId) => {
    try {
      const res = await axios.delete(`api/ulcircuits/delete/${circuitId}`);
      return {
        success: res.data.success,
        message: res.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data.message || "Invalid main document id",
      };
    }
  },

  updateCircuit: async (circuitId, updatedCircuit) => {
    if (!updatedCircuit) {
      console.log("Empty Update, Will remain unchanged");
      return null;
    }
    try {
      const res = await axios.put(
        `/api/ulcircuits/update/${circuitId}`,
        updatedCircuit,
        { headers: { "Content-Type": "application/json" } }
      );
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data.message || "Failed to update main document!",
      };
    }
  },
}));
