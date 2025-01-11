import axios from "axios";
import { create } from "zustand";

export const useMicroCircuits = create((set) => ({
  microCircuit: [],
  setMicroCIrcuit: (microCircuit) => set({ microCircuit }),

  createMicroCircuit: async (newMicroCircuit) => {
    if (!newMicroCircuit.circuitName) {
      return { success: false, message: "Please add a circuit name!" };
    }
    try {
      const res = await axios.post(
        "/api/microcircuits/createmicro",
        newMicroCircuit,
        { headers: { "Content-Type": "application/json" } }
      );
      set((state) => ({
        microCircuit: [...state.microCircuit, res.data.data],
      }));
      return { success: true, message: "Circuit Created sucessfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },

  fetchMicroCircuits: async () => {
    try {
      const res = await axios.get("/api/microcircuits/getall");

      set({ microCircuit: res.data.allCircuits });
    } catch (error) {
      console.error("Error fetching microprocessor circuits:", error);
    }
  },

  fetchSingleCircuit: async (id) => {
    if (!id) {
      console.log("No ID provided to fetch a Micro circuit");
      return null;
    }
    try {
      const res = await axios.get(`/api/microcircuits/getbyid/${id}`);
      return res.data.circuit;
    } catch (error) {
      console.log("Error Fetching this ID in microprocessor circuits:", error);
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
      const res = await axios.delete(
        `/api/microcircuits/delete/${circuitid}/${contentid}`
      );
      return res.data.circuit;
    } catch (error) {
      console.error(
        "Error Deleting this ID in combinational logic circuits:",
        error
      );
    }
    return null;
  },

  updateContent: async (circuitid, contentid, updatedContent) => {
    if (!contentid) {
      console.log("No ID provided to delete a Content");
      return null;
    }
    if (!circuitid) {
      console.log("No Circuit ID provided to delete a Content");
      return null;
    }
    try {
      const res = await axios.put(
        `/api/microcircuits/update/${circuitid}`,
        updatedContent,
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
          error.response?.data?.message ||
          "An error occurred in updating the content",
      };
    }
  },
  updateAddContent: async (circuitid, type, updateAddContent) => {
    const validTypes = ["Text", "Image", "TextAndImage", "Code"];
    if (!validTypes.includes(type)) {
      console.log("The Type provided is invalid");
      return null;
    }
    try {
      const res = await axios.put(
        `/api/microcircuits/addcontent/${circuitid}`,
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
      const res = await axios.delete(`api/microcircuits/delete/${circuitId}`);
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
        `/api/microcircuits/update/${circuitId}`,
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
