import combiLogicModel from "../models/combilogic.model.js";
import mongoose from "mongoose";

//Create New Combi Logic Circuit
export const addCBCircuit = async (req, res) => {
  const reqCBCircuit = req.body;
  if (!reqCBCircuit.combiLogicCircuitName) {
    return res
      .status(400)
      .json({ success: false, message: "please fill the circuit name field" });
  }

  if (!reqCBCircuit.imageUrl) {
    reqCBCircuit.imageUrl = "No image URL";
  }

  const newCbCircuit = new combiLogicModel(reqCBCircuit);

  try {
    await newCbCircuit.save();
    res.status(201).json({
      success: true,
      message: "Create new Combinational Circuit!",
      data: newCbCircuit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error Node!" });
    console.log(error);
  }
};

//Get All Combinational Logic Circuit
export const getAllCb = async (req, res) => {
  try {
    const allCBCircuit = await combiLogicModel.find({});
    res.status(201).json({ success: true, allCircuits: allCBCircuit });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error Node!" });
    console.log(error);
  }
};

//Update One Combinational Logic Circuit by using an ID in MongoDb
export const updateCBById = async (req, res) => {
  const { id } = req.params;
  const toBeUpdatedCBCircuit = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Can't find Combinational Circuit" });
  }

  try {
    const updatedCBCircuit = await combiLogicModel.findByIdAndUpdate(
      id,
      toBeUpdatedCBCircuit,
      { new: true }
    );
    res.status(200).json({ success: true, message: updatedCBCircuit });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Eroor Node!" });
    console.log(error);
  }
};

//Delete Combinational Logic Circuit by using an ID in MongoDb
export const deleteCB = async (req, res) => {
  const { id } = req.params;
  try {
    res
      .status(200)
      .json({ success: true, message: "Combincational Logic Circuit Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error Node!" });
    console.log(error);
  }
};
