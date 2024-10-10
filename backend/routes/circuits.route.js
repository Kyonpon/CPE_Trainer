import express from "express";
import {
  addCircuit,
  deleteCircuit,
  getAllCircuits,
  updateCircuit,
} from "../controllers/circuits.controller.js";

const router = express.Router();

//Single ADD
//Create
router.post("/", addCircuit);

//GET all circuits
//Read
router.get("/getall", getAllCircuits);

//Update circuits only one field
//Update
router.put("/update/:id", updateCircuit);

//Delete by ID
//Delete
router.delete("/:id", deleteCircuit);

export { router as CircuitAPI };
