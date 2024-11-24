import v2CombiLogicModel from "../models/v2.combilogic.model.js";
import mongoose from "mongoose";

//#region Create New V2 Combi Logic Circuit
export const v2addCBcircuit = async (req, res) => {
  const tbaCBCircuit = req.body;

  // Validate content array

  if (
    !Array.isArray(tbaCBCircuit.content) ||
    tbaCBCircuit.content.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Content array is required and cannot be empty.",
    });
  }

  // Loop through each item in content array
  for (let i = 0; i < tbaCBCircuit.content.length; i++) {
    const contentItem = tbaCBCircuit.content[i];

    // Handle text type content
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

  // Create new circuit document
  const newCBCircuit = new v2CombiLogicModel(tbaCBCircuit);

  try {
    await newCBCircuit.save();
    res.status(201).json({
      success: true,
      message: "Created new Combinational Circuit",
      data: newCBCircuit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Creating New",
    });
    console.log(error);
  }
};
//#endregion

//#region Get All Combinational Logic Circuit
export const v2getAllCb = async (req, res) => {
  try {
    const allCBCircuit = await v2CombiLogicModel.find({});
    res.status(200).json({ success: true, allCircuits: allCBCircuit });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Can't get all CB Circuit" });
    console.log(error);
  }
};
//#endregion

//Get a Combinational Logic Circuit By their document id
export const v2getCBById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Can't find the CB logic" });
  }

  try {
    const gotCB = await v2CombiLogicModel.findById(id);
    res.status(200).json({ success: true, circuit: gotCB });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error getCBByID" });
  }
};

//#region UPDATE COMBINATIONAL LOGIC CIRCUIT OR A SPECIFIC CONTENT ITEM /maindocid/contentid
export const v2UpdateCBById = async (req, res) => {
  const { id } = req.params; // ID OF THE MAIN DOCUMENT
  const { contentId } = req.body; // ID OF THE CONTENT ITEM, IF UPDATING A SPECIFIC ONE
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "INVALID MAIN DOCUMENT ID" });
  }

  try {
    if (contentId) {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res
          .status(404)
          .json({ success: false, message: "INVALID CONTENT ITEM ID" });
      }

      console.log("UPDATE DATA:", updateData);
      console.log(
        "COMPUTED UPDATE OBJECT:",
        Object.keys(updateData).reduce((acc, key) => {
          acc[`content.$.${key}`] = updateData[key];
          return acc;
        }, {})
      );

      const updatedDocument = await v2CombiLogicModel.findOneAndUpdate(
        { _id: id, "content._id": contentId },
        {
          $set: Object.keys(updateData).reduce((acc, key) => {
            acc[`content.$.${key}`] = updateData[key];
            return acc;
          }, {}),
        },
        { new: true }
      );

      if (!updatedDocument) {
        return res
          .status(404)
          .json({ success: false, message: "CONTENT ITEM NOT FOUND" });
      }

      return res.status(200).json({
        success: true,
        message: "CONTENT ITEM UPDATED",
        data: updatedDocument,
      });
    }

    const updatedCBCircuit = await v2CombiLogicModel.findByIdAndUpdate(
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
  } catch (error) {
    res.status(500).json({ success: false, message: "SERVER ERROR" });
    console.log(error);
  }
};
//#endregion

//#region  Delete Combinational Logic Circuit by using an ID in MongoDb
export const v2DeleteCB = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDocument = await v2CombiLogicModel.findOneAndDelete({
      _id: id,
    });

    if (!deletedDocument) {
      return res.status(404).json({
        success: false,
        message: "Combinational Logic Circuit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Combinational Logic Circuit Deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error Node!" });
    console.log(error);
  }
};
//#endregion

//#region  Delete Combinational Logic Circuit Content by using /:maindocid/:contentid
export const v2DeleteContentById = async (req, res) => {
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
    const updatedDocument = await v2CombiLogicModel.findOneAndUpdate(
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
//#endregion

//#region Add Content main document
export const v2AddToContent = async (req, res) => {
  const { id } = req.params; // ID of the main document
  const newContentItem = req.body; // New content item to be added

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid main document ID",
    });
  }

  try {
    // Use runValidators to enforce schema validation
    const updatedDocument = await v2CombiLogicModel.findByIdAndUpdate(
      id,
      { $push: { content: newContentItem } },
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Main document not found",
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
      message: "Validation failed or server error",
      error: error.message, // Return the specific validation error
    });
    console.log(error);
  }
};
//#endregion
