import express from "express";
import { addCBcircuit } from "../controllers/v2.combilogic.controller";

const router = express.Router();

router.post("/createcb", addCBcircuit);

export { router as CBCircuitAPIv2 };
