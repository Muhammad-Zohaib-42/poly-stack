import mongoose, {Schema} from "mongoose"
import crypto from "crypto"

const otpSchema = new Schema({
  otp: {
    type: String,
    required: [true, "OTP is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User id is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 15 * 60 * 1000
  }
}, {timestamps: true})

otpSchema.methods.isOtpCorrect = function(otp) {
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex")
  return otpHash == this.otp
}

export const otpModel = mongoose.model("Otp", otpSchema)