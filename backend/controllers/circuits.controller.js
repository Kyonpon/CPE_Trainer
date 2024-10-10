import CircuitModel from "../models/circuit.model.js";
import mongoose from "mongoose";

//Create
export const addCircuit = async (req, res) => {
  const circuit = req.body;
  if (!circuit.name || !circuit.activity || !circuit.image) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const newCircuit = new CircuitModel(circuit);

  try {
    await newCircuit.save();
    res.status(201).json({ success: true, data: "newCircuit" });
  } catch (error) {
    console.log("Error in create product");
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Read
export const getAllCircuits = async (req, res) => {
  try {
    const circuits = await CircuitModel.find({});
    res.status(200).json({ message: "Success", data: circuits });
  } catch (error) {
    console.log("Error can't connect to DB", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Update
export const updateCircuit = async (req, res) => {
  const { id } = req.params;
  const circuit = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid circuit Id" });
  }

  try {
    const updatedCircuit = await CircuitModel.findByIdAndUpdate(id, circuit, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedCircuit });
  } catch (error) {
    console.log("Error!", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Delete
export const deleteCircuit = async (req, res) => {
  const { id } = req.params;
  try {
    await CircuitModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Circuit Deleted" });
  } catch (error) {
    console.log("Error can't find circuit");
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
