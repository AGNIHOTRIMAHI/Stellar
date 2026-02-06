import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: String,
  city: String,
});

export default mongoose.model("Theatre", theatreSchema);
