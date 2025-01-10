import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Text", "Image", "TextAndImage"],
  },
  text: {
    type: String,
    required: function () {
      return this.type === "Text" || this.type === "TextAndImage";
    },
  },
  imageUrl: {
    type: String,
    required: function () {
      return this.type === "Image" || this.type === "TextAndImage";
    },
  },
  altText: {
    type: String,
    required: function () {
      return this.type === "Image" || this.type === "TextAndImage";
    },
  },
});

const v2CombiLogicSchema = new mongoose.Schema({
  circuitName: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },

  content: [contentSchema],
});

const v2CombiLogicModel = mongoose.model(
  "Combinational_Logic_Circuit2", //This line Determines what is the name of the Collection
  v2CombiLogicSchema
);

export default v2CombiLogicModel;
