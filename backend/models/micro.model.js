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

const microSchema = new mongoose.Schema({
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

const microModel = mongoose.model("Microprocessor_Circuit", microSchema);

export default microModel;
