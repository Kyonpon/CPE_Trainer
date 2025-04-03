import express from "express";
import {
  getModuleCheckTable,
  getTestResultsRandom,
  testSend,
} from "../controllers/circuitchecker.controller.js";

const router = express.Router();

router.post("/getchecktt", getModuleCheckTable);
router.get("/test/:modulename", testSend);
router.get("/random/:modulename", getTestResultsRandom);

export { router as CircuitCheckerAPI };
