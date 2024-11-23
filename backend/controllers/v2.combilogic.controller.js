import v2CombiLogicModel from "../models/v2.combilogic.model.js";

// Create New V2 Combi Logic Circuit
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
