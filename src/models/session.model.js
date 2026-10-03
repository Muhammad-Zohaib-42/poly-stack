import mongoose, {Schema} from "mongoose";

const sessionSchema = new Schema({
  refreshToken: {
    type: String,
    required: [true, "Refresh Token is required"]
  },
  ip: {
    type: String,
    required: [true, "IP is required"]
  },
  userAgent: {
    type: String, 
    required: [true, "User Agent is required"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User id is required"]
  }
}, {timestamps: true})

export const sessionModel = mongoose.model("Session", sessionSchema)