import express from "express";
import { getModuleCheckTable } from "../controllers/circuitchecker.controller.js";

const router = express.Router();

router.post("/getchecktt", getModuleCheckTable)


export {router as CircuitCheckerAPI}