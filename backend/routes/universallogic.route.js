import express from "express";
import {
  addULCircuit,
  deleteUL,
  getAllUL,
  updateUL,
} from "../controllers/universallogic.controller.js";

const router = express.Router();

//Create
router.post("/createul", addULCircuit);

//Read all
router.get("/getall", getAllUL);

//update by ID
router.put("/update/:id", updateUL);

//delete by ID
router.delete("/delete/:id", deleteUL);

export { router as ULCircuitAPI };
