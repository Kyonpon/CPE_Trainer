import express from "express";
import {
  addCBCircuit,
  deleteCB,
  getAllCb,
  updateCBById,
} from "../controllers/combilogic.controller.js";

const router = express.Router();

//Create
router.post("/createcb", addCBCircuit);

//Read all
router.get("/getall", getAllCb);

//Update by ID
router.put("/update/:id", updateCBById);

//Delete by ID
router.delete("/delete/:id", deleteCB);

export { router as CBCircuitAPI };
