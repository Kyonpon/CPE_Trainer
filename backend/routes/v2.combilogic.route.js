import express from "express";
import { v2addCBcircuit } from "../controllers/v2.combilogic.controller.js";

const router = express.Router();

router.post("/createcb", v2addCBcircuit);

export { router as CBCircuitAPIv2 };
