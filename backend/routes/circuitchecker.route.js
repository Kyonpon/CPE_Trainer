import express from "express";
import {
  getModuleCheckTable,
  getTestResults,
  sendTestData,
} from "../controllers/circuitchecker.controller.js";

const router = express.Router();

router.post("/getchecktt", getModuleCheckTable);
router.get("/testdata/:modulename", sendTestData);

router.post("/testresults/:moduleName", getTestResults);

export { router as CircuitCheckerAPI };
