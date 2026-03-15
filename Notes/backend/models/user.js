import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true,   // allows multiple docs with no firebaseUid (null-safe unique)
  },
  avatar: {
    type: String,
    default: "",
  },
  credits: {
    type: Number,
    default: 50,
    min: 0,
  },
  isCreditAvailable: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Notes",
    default: [],
  },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User