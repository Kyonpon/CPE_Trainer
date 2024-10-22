import mongoose from "mongoose";

const universalLogicSchema = new mongoose.Schema({
  universalCircuitName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

const universalLogicModel = mongoose.model(
  "Universal_Logic_Circuit",
  universalLogicSchema
);

export default universalLogicModel;
