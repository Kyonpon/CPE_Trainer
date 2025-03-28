import v2UniversalLogicModel from "../models/v2.universallogic.model";
import mongoose from "mongoose";

export const v2AddULcircuit = async (req, res) => {
  const tbaULCircuit = req.body;

  if (
    !Array.isArray(tbaULCircuit.content) ||
    tbaULCircuit.content.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Content array is required and cannot be empty.",
    });
  }

  for (let i = 0; i < tbaULCircuit.content.length; i++) {
    const contentItem = tbaULCircuit.content[i];

    if (contentItem.type === "Text" || contentItem.type === "TextAndImage") {
      if (!contentItem.text) {
        return res.status(400).json({
          success: false,
          message: `Text is required for item ${i + 1} in content.`,
        });
      }
    }

    if (contentItem.type === "Image" || contentItem.type === "TextAndImage") {
      if (!contentItem.imageUrl) {
        return res.status(400).json({
          success: false,
          message: `Image URL is required for item ${i + 1} in content.`,
        });
      }
    }

    if (!contentItem.altText) {
      contentItem.altText = "No alt text";
    }
  }

  const newULCircuit = new v2UniversalLogicModel(tbaULCircuit);

  try {
    await newULCircuit.save();
    res.status(201).json({
      success: true,
      message: "Created new Universal Circuit",
      data: newULCircuit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
    console.log(error);
  }
};

export const v2GetAllUL = async (req, res) => {
  try {
    const allULCircuit = await v2UniversalLogicModel.find({});
    res.status(200).json({ success: true, allCircuits: allULCircuit });
  } catch (error) {
    res.status(500).json *
      { success: false, message: "Unable to retrieve universal circuits" };
    console.log(error);
  }
};

export const v2getCBById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid circuit ID" });
  }

  try {
  } catch (error) {}
};
