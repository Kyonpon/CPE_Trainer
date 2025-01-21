import { create } from "zustand";
import axios from "axios";

export const useLogin = create((set) => ({
  admin: false,
  setAdmin: (admin) => set({ admin }),

  showEdit: async (id) => {
    try {
      const res = await axios.get(`/api/users/checkadmin/${id}`);
      console.log("Response from backend:", res.data); // Debugging log
      if (res.data && res.data.userData) {
        return res.data.userData.admin; // Correctly access the `admin` property
      } else {
        console.log("User data not found in response");
        return false;
      }
    } catch (error) {
      console.error("Error in showEdit:", error);
      return false; // Handle error gracefully
    }
  },
}));
