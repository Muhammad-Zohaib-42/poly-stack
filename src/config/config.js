import "dotenv/config"

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
const SENDER_EMAIL = process.env.SENDER_EMAIL
const BREVO_API_KEY = process.env.BREVO_API_KEY
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const NODE_ENV = process.env.NODE_ENV
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const ORIGIN = process.env.ORIGIN


if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables")
}

if (!PORT) {
  throw new Error("PORT is not defined in the environment variables")
}

if (!SENDER_EMAIL) {
  throw new Error("SENDER_EMAIL is not defined in the environment varaibles")
}

if (!BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is not defined in the environment varaibles")
}

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment varaibles")
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined in the environment varaibles")
}

if (!NODE_ENV) {
  throw new Error("NODE_ENV is not defined in the environment varaibles")
}

if (!CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not defined in the environment varaibles")
}

if (!CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not defined in the environment varaibles")
}

if (!CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not defined in the environment varaibles")
}

if (!ORIGIN) {
  throw new Error("ORIGIN is not defined in the environment varaibles")
}

export const config = {
  MONGODB_URI,
  PORT,
  SENDER_EMAIL,
  BREVO_API_KEY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  NODE_ENV,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  ORIGIN
}