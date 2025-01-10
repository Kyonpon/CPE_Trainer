import mongoose from "mongoose";

const combiLogicSchema = new mongoose.Schema({
  combiLogicCircuitName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

const combiLogicModel = mongoose.model(
  "Combinational_Logic_Circuit",
  combiLogicSchema
);

export default combiLogicModel;
