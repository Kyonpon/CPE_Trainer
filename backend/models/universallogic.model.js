import mongoose from "mongoose";

const universalLogicSchema = new mongoose.Schema({
  circuit: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const universalLogicModel = mongoose.model(
  "Universal_Logic_Circuit",
  universalLogicSchema
);

export default universalLogicModel;
