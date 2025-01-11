import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Text", "Image", "TextAndImage", "Code"],
    required: true,
  },
  text: {
    type: String,
    validate: {
      validator: function (v) {
        return this.type === "Text" || this.type === "TextAndImage"
          ? !!v
          : true;
      },
      message: "Text is required for type 'Text' or 'TextAndImage'.",
    },
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return this.type === "Image" || this.type === "TextAndImage"
          ? !!v
          : true;
      },
      message: "Image URL is required for type 'Image' or 'TextAndImage'.",
    },
  },
  altText: {
    type: String,
    validate: {
      validator: function (v) {
        return this.type === "Image" || this.type === "TextAndImage"
          ? !!v
          : true;
      },
      message: "Alt text is required for type 'Image' or 'TextAndImage'.",
    },
  },
  code: {
    type: String,
    validate: {
      validator: function (v) {
        return this.type === "Code" ? !!v : true;
      },
      message: "Code is required for type 'Code'.",
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
