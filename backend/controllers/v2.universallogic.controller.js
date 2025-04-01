import v2UniversalLogicModel from "../models/v2.universallogic.model.js";
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

export const v2getULById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid circuit ID" });
  }

  try {
    const gotUL = await v2UniversalLogicModel.findById(id);
    res.status(200).json({ success: true, gotUL });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unable to retrieve circuit" });
  }
};

export const v2UpdataULById = async (req, res) => {
  const { id } = req.params;
  const { contentId, ...updateData } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid circuit ID" });
  }

  try {
    if (contentId) {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid content ID" });
      }

      const mainDoc = await v2UniversalLogicModel.findOne({
        _id: id,
        "content._id": contentId,
      });

      if (!mainDoc) {
        return res.status(404).json({
          success: false,
          message: "Content item not found in the main document",
        });
      }
      const contentItem = mainDoc.content.find(
        (item) => item._id.toString() === contentId
      );

      if (!contentItem) {
        return res.status(404).json({
          success: false,
          message: "Content item not found",
        });
      }

      const allowedFields = {
        Text: ["text", "altText"],
        Image: ["imageUrl", "altText"],
        TextAndImage: ["text", "imageUrl", "altText"],
      };

      const fieldsToUpdate = allowedFields[contentItem.type] || [];
      const validFields = Object.keys(updateData).reduce((acc, key) => {
        if (fieldsToUpdate.includes(key)) {
          acc[`content.$.${key}`] = updateData[key];
        }
        return acc;
      }, {});

      if (Object.keys(validFields).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "NO VALID FIELDS TO UPDATE" });
      }

      const updatedDocument = await v2UniversalLogicModel.findOneAndUpdate(
        { _id: id, "content._id": contentId },
        { $set: validFields },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({
          success: false,
          message: "Failed to update content item",
        });
      }

      res.status(200).json({
        success: true,
        message: "Content item updated successfully",
        data: updatedDocument,
      });

      //Update the main document directly
      const updatedULCircuit = await v2UniversalLogicModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedCBCircuit) {
        return res
          .status(404)
          .json({ success: false, message: "MAIN DOCUMENT NOT FOUND" });
      }

      res.status(200).json({
        success: true,
        message: "MAIN DOCUMENT UPDATED",
        data: updatedCBCircuit,
      });
    }
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "MAIN DOCUMENT UPDATED",
      data: updatedCBCircuit,
    });
  }
};

export const v2DeleteUL = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteULCircuit = await v2UniversalLogicModel.findByIdAndDelete({
      _id: id,
    });

    if (!deleteULCircuit) {
      return res.status(404).json({
        success: false,
        message: "Circuit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Circuit Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete circuit",
    });
    console.log(error);
  }
};

export const v2DeleteContentById = async (req, res) => {
  const { id, contentId } = req.params; // Get the main document ID and content item ID from params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid content ID" });
  }

  try {
    const deletedDocument = await v2UniversalLogicModel.findOneAndUpdate(
      { _id: id },
      { $pull: { content: { _id: contentId } } }, // Pull (remove) the content item with the given contentId

      { new: true } // Return the updated document
    );

    if (!deletedDocument) {
      return res.status(404).json({
        success: false,
        message: "Content item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content item deleted successfully",
      data: deletedDocument,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
    console.log(error);
  }
};

export const v2AddToULContent = async (req, res) => {
  const { id } = req.params;
  const newContentItem = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid ID" });
  }

  try {
    const updatedDocument = await v2UniversalLogicModel.findOneAndUpdate(
      { _id: id },
      { $push: { content: newContentItem } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content item added successfully",
      data: updatedDocument,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
