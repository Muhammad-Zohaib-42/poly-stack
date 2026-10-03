import {v2 as cloudinary} from "cloudinary"
import { config } from "../config/config.js"
import fs from "fs"

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
})

export async function uploadOnCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath)
    return result.secure_url
  } catch (error) {
    console.log(error)
    throw error    
  } finally {
    fs.unlinkSync(filePath)
  }
}