import express from "express";
import {
  addULCircuit,
  getAllUL,
} from "../controllers/universallogic.controller.js";

const router = express.Router();

//Create
router.post("/createul", addULCircuit);

//Read all
router.get("/getall", getAllUL);

export { router as ULCircuitAPI };
