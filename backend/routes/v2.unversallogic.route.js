import express from "express";
import {
  v2AddToULContent,
  v2AddULcircuit,
  v2GetAllUL,
  v2getULById,
  v2UpdataULById,
} from "../controllers/v2.universallogic.controller";
import {
  v2DeleteCB,
  v2DeleteContentById,
} from "../controllers/v2.combilogic.controller";

const router = express.Router();

router.post("/createul", v2AddULcircuit);
router.get("/getall", v2GetAllUL);
router.get("/getbyid/:id", v2getULById);
router.put("/update/:id", v2UpdataULById);
router.delete("/delete/:id", v2DeleteCB);
router.delete("/delete/:id/:contentId", v2DeleteContentById);
router.put("/addcontent/:id", v2AddToULContent);

export { router as ULCircuitAPIv2 };
