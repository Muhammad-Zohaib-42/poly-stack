import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({
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
  }
}, {timestamps: true})

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)
}

export const userModel = mongoose.model("User", userSchema)