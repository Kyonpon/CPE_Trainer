import v2CombiLogicModel from "../models/v2.combilogic.model";
import mongoose from "mongoose";

//Create New V2 Combi Logic Circuit
export const addCBcircuit = async (req, res) => {
  const tbaCBCircuit = req.body;
  if (tbaCBCircuit.type === "Text" || tbaCBCircuit.type === "TextAndImage") {
    if (!tbaCBCircuit.text) {
      return res
        .status(400)
        .json({ success: false, message: "please fill out the text field" });
    }
  }

  if (tbaCBCircuit.type === "Image" || tbaCBCircuit.type === "TextAndImage") {
    if (!tbaCBCircuit.imageUrl) {
      return res.status(400).json({
        success: false,
        message: "please fill out the image URL field",
      });
    }

    if (!tbaCBCircuit.altText) {
      tbaCBCircuit.altText = "No alt Text";
    }
  }

  const newCBCircuit = new v2CombiLogicModel(tbaCBCircuit);

  try {
    await newCBCircuit.save();
    res.status(201).json({
      success: true,
      message: "Created new Combinational Circuit",
      data: newCBCircuit,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error Creating New" });
    console.log(error);
  }
};
