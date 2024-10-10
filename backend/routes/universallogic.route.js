import express from "express";
import {
  addULCircuit,
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

export { router as ULCircuitAPI };
