import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

const userSchema = new Schema({
  avatar: {
    type: String,
    required: [true, "Avatar is required"]
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isVerified: this.isVerified
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m"
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d"
    }
  )
}

export const userModel = mongoose.model("User", userSchema)