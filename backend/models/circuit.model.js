import mongoose from "mongoose";

const circuitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    activity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CircuitModel = mongoose.model("Circuit", circuitSchema);

export default CircuitModel;
