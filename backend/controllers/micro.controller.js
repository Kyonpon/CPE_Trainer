import microModel from "../models/micro.model.js";
import mongoose from "mongoose";

//#region Create New Micro Circuit
export const addMicroCircuit = async (req, res) => {
  const tbaMicroCircuit = req.body;

  // validate content array
  if (
    !Array.isArray(tbaMicroCircuit.content) ||
    tbaMicroCircuit.content.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Content array is required and cannot be empty.",
    });
  }

  for (let i = 0; i < tbaMicroCircuit.content.length; i++) {
    const contentItem = tbaMicroCircuit.content[i];

    if (contentItem.type === "Text" || contentItem.type === "TextAndImage") {
      if (!contentItem.text) {
        return res.status(400).json({
          success: false,
          message: `Text is required for item ${i + 1} in content.`,
        });
      }
    }

    // Handle image type content
    if (contentItem.type === "Image" || contentItem.type === "TextAndImage") {
      if (!contentItem.imageUrl) {
        return res.status(400).json({
          success: false,
          message: `Image URL is required for item ${i + 1} in content.`,
        });
      }

      // Set default alt text if not provided
      if (!contentItem.altText) {
        contentItem.altText = "No alt text";
      }
    }
  }

  //Create new Circuit this is after all the validations
  const newMicroCircuit = new microModel(tbaMicroCircuit);

  try {
    await newMicroCircuit.save();
    res.status(201).json({
      success: true,
      message: "Created new Microprocessor Circuit",
      data: newMicroCircuit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Backend Error Creating New Circuit",
    });
    console.log(error);
  }
};
//#endregion

//#region Get All Microprocessor Circuit
export const getAllMicro = async (req, res) => {
  try {
    const allMicroCircuit = await microModel.find({});
    res.status(200).json({ success: true, allCircuits: allMicroCircuit });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Backend Error Creating New Circuit" });
    console.log(error);
  }
};
//#endregion

//#region Get a Microprocessor Circuit By their document ID
export const getMicroById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Can't find the Micro Circuit!" });
  }

  try {
    const gotMicro = await microModel.findById(id);
    res.status(200).json({ success: true, circuit: gotMicro });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Backend Error, getMicroById" });
  }
};

//#region Update Microprocessor Circuit or a specific Content Item /maindocid/contentid
export const updateMicroByID = async (req, res) => {
  const { id } = req.params; //ID of the main document
  const { contentId, ...updateData } = req.body; // Seperate contentId fron updateData

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Main Document Id" });
  }

  try {
    if (contentId) {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid Content Item Id" });
      }

      //Fetch the specific content item to determine it's type
      const mainDoc = await microModel.findOne({
        _id: id,
        "content._id": contentId,
      });

      if (!mainDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Content Item Not Found" });
      }

      const contentItem = mainDoc.content.find(
        (item) => item._id.toString() === contentId
      );

      if (!contentItem) {
        return res
          .status(404)
          .json({ success: false, message: "Content Item Not Found 2" });
      }

      //Define allowed fields for each type
      const allowedFields = {
        Text: ["text"],
        Image: ["imageUrl", "altText"],
        TextAndImage: ["text", "imageUrl", "altText"],
      };

      //Get allowed field based on the type
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

      const updatedDocument = await microModel.findOneAndUpdate(
        { _id: id, "content._id": contentId },
        { $set: validFields },
        { new: true }
      );

      if (!updatedDocument) {
        return res
          .status(404)
          .json({ success: false, message: "Content Item Not Found 3" });
      }

      return res.status(200).json({
        success: true,
        message: "Content Item Updated",
        data: updatedDocument,
      });
    }

    //------------------------------------------------------
    //Update The Main Document Directly
    const updatedMicro = await microModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedMicro) {
      return res
        .status(404)
        .json({ success: false, message: "Main Document Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Main Document Updated",
      data: updatedMicro,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Backend Error, UpdateMicroById" });
  }
};
//#endregion

//#region Delete Microprocessor Circuit
export const deleteMicro = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDocument = await microModel.findByIdAndDelete({ _id: id });
    if (!deletedDocument) {
      return res.status(404).json({
        success: false,
        message: "Microprocessor Circuit not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Microprocessor Circuit Deleted",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Backend Error, deleteMicro" });
    console.log(error);
  }
};
//#endregion

//#region Delete Microprocessor Circuit Content using /maindocid/contentid
export const deleteContentById = async (req, res) => {
  const { id, contentId } = req.params; // Get the main document ID and content item ID from params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid main document ID",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return res.status(404).json({
      success: false,
      message: "Invalid content item ID",
    });
  }

  try {
    // Find the document by id and remove the content item with the specified contentId
    const updatedDocument = await microModel.findOneAndUpdate(
      { _id: id },
      { $pull: { content: { _id: contentId } } }, // Pull (remove) the content item with the given contentId
      { new: true } // Return the updated document
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Combinational Logic Circuit not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content item deleted",
      data: updatedDocument,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.log(error);
  }
};

//#region Add Content main document
export const addToContent = async (req, res) => {
  const { id } = req.params;
  const newContentItem = req.body;

  //Validators
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Main Document ID" });
  }

  try {
    //Use Runvalidator to enforce schema validations
    const updatedDocument = await microModel.findByIdAndUpdate(
      id,
      { $push: { content: newContentItem } },
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Main Document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "New content item added",
      data: updatedDocument,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Backend Error, addToContent",
    });
    console.log(error);
  }
};
