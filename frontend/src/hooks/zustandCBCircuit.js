import axios from "axios";
import { create } from "zustand";

export const useCBCircuits = create((set) => ({
  combiLogicCircuit: [],
  setCombiLogicCircuit: (combiLogicCircuit) => set({ combiLogicCircuit }),

  createCombiLogicCircuit: async (newCombiLogicCircuit) => {
    if (!newCombiLogicCircuit.circuitName) {
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

  fetchCBCircuits: async () => {
    try {
      const res = await axios.get("/api/cbcircuits/getall");

      set({ combiLogicCircuit: res.data.allCircuits });
    } catch (error) {
      console.error("Error fetching combinational logic circuits:", error);
    }
  },

  fetchSingleCBCircuit: async (id) => {
    if (!id) {
      console.log("No ID provided to fetch a CB circuit");
      return null;
    }
    try {
      const res = await axios.get(`/api/cbcircuits/getbyid/${id}`);
      return res.data.circuit;
    } catch (error) {
      console.log(
        "Error Fetching this ID in combinational logic circuits:",
        error
      );
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
        `/api/cbcircuits/delete/${circuitid}/${contentid}`
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
        `/api/cbcircuits/update/${circuitid}`,
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
    const validTypes = ["Text", "Image", "TextAndImage"];
    if (!validTypes.includes(type)) {
      console.log("The Type provided is invalid");
      return null;
    }
    try {
      const res = await axios.put(
        `/api/cbcircuits/addcontent/${circuitid}`,
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
}));
