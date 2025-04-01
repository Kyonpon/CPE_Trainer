import express from "express";
import {
  v2AddToULContent,
  v2AddULcircuit,
  v2DeleteContentById,
  v2DeleteUL,
  v2GetAllUL,
  v2getULById,
  v2UpdataULById,
} from "../controllers/v2.universallogic.controller.js";

const router = express.Router();

router.post("/createul", v2AddULcircuit);
router.get("/getall", v2GetAllUL);
router.get("/getbyid/:id", v2getULById);
router.put("/update/:id", v2UpdataULById);
router.delete("/delete/:id", v2DeleteUL);
router.delete("/delete/:id/:contentId", v2DeleteContentById);
router.put("/addcontent/:id", v2AddToULContent);

export { router as ULCircuitAPIv2 };
