import express from "express";
import {
  getModuleCheckTable,
  getTestResults,
  getTestResultsRandom,
  sendTestData,
} from "../controllers/circuitchecker.controller.js";

const router = express.Router();

router.post("/getchecktt", getModuleCheckTable);
router.get("/testdata/:modulename", sendTestData);
router.get("/random/:modulename", getTestResultsRandom);
router.post("/testresults/:moduleName", getTestResults )

export { router as CircuitCheckerAPI };
