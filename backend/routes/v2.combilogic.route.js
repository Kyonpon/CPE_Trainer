import express from "express";
import {
  v2addCBcircuit,
  v2AddToContent,
  v2DeleteCB,
  v2DeleteContentById,
  v2getAllCb,
  v2getCBById,
  v2UpdateCBById,
} from "../controllers/v2.combilogic.controller.js";

const router = express.Router();

router.post("/createcb", v2addCBcircuit);
router.get("/getall", v2getAllCb);
router.get("/getbyid/:id", v2getCBById);
router.put("/update/:id", v2UpdateCBById);
router.delete("/delete/:id", v2DeleteCB);
router.delete("/delete/:id/:contentId", v2DeleteContentById);
router.put("/addcontent/:id", v2AddToContent);

export { router as CBCircuitAPIv2 };
