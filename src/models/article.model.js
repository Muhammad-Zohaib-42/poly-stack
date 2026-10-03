import mongoose, {Schema} from "mongoose"

const articleSchema = new Schema({
  images: {
    type: [String]
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User id is required"]
  }
}, {timestamps: true})

export const articleModel = mongoose.model("Article", articleSchema)