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

  if (!ULCircuit.image) {
    ULCircuit.image = "no Image URL";
  }

  const newULCircuit = new universalLogicModel(ULCircuit);

  try {
    await newULCircuit.save();
    res.status(201).json({ success: true, message: "Created new circuit" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
    console.log(error);
  }
};

//get all
export const getAllUL = async (req, res) => {
  try {
    const allUL = await universalLogicModel.find({});
    res.status(201).json({ success: true, allCircuits: allUL });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
    console.log(error);
  }
};

//Update
export const updateUL = async (req, res) => {
  const { id } = req.params;
  const toBeULCircuit = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Can't find Universal Circuit" });
  }

  try {
    const updatedUL = await universalLogicModel.findByIdAndUpdate(
      id,
      toBeULCircuit,
      { new: true }
    );
    res.status(200).json({ success: true, message: updatedUL });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error! can't Update" });
    console.log(error);
  }
};

//delete
export const deleteUL = async (req, res) => {
  const { id } = req.params;
  try {
    await universalLogicModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Universal Circuit Deleted!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error! Can't Delete" });
    console.log(error);
  }
};
