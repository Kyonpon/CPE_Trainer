import express from "express";
import {
  getModuleCheckTable,
  testSend,
} from "../controllers/circuitchecker.controller.js";

const router = express.Router();

router.post("/getchecktt", getModuleCheckTable);
router.get("/test/:modulename", testSend);

export { router as CircuitCheckerAPI };
