import universalLogicModel from "../models/universallogic.model.js";
import mongoose from "mongoose";

//Crete new circuit
export const addULCircuit = async (req, res) => {
  const ULCircuit = req.body;
  if (!ULCircuit.circuit) {
    return res
      .status(400)
      .json({ success: false, message: "please fill the circuit field" });
  }

  ULCircuit.image = "no Image URL";

  const newULCircuit = new universalLogicModel(ULCircuit);

  try {
    await newULCircuit.save();
    res.status(201).json({ success: true, message: "Created new circuit" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
    console.log(error);
  }
};

export const getAllUL = async (req, res) => {
  try {
    const allUL = await universalLogicModel.find({});
    res.status(201).json({ success: true, allCircuits: allUL });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
    console.log(error);
  }
};
