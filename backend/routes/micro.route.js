import express from "express";
import {
  addMicroCircuit,
  addToContent,
  deleteContentById,
  deleteMicro,
  getAllMicro,
  getMicroById,
  updateMicroByID,
} from "../controllers/micro.controller.js";

const router = express.Router();

router.post("/createmicro", addMicroCircuit);
router.get("/getall", getAllMicro);
router.get("/getbyid/:id", getMicroById);
router.put("/update/:id", updateMicroByID);
router.delete("/delete/:id", deleteMicro);
router.delete("/delete/:id/:contentid", deleteContentById);
router.put("/addcontent/:id", addToContent);

export { router as MicroCircuitAPI };
