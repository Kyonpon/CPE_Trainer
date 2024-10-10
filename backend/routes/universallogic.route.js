import express from "express";
import { addULCircuit } from "../controllers/universallogic.controller.js";

const router = express.Router();

//Create
router.post("/createul", addULCircuit);

export { router as ULCircuitAPI };
