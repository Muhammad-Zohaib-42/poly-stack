import { config } from "./config/config.js"

export const DB_NAME = "polyStack"

export const accessTokenOptions = {
  httpOnly: true,
  secure: config.NODE_ENV == "production",
  sameSite: config.NODE_ENV == "production" ? "none" : "strict",
  maxAge: 15 * 60 * 1000
}

export const refreshTokenOptions = {
  httpOnly: true,
  secure: config.NODE_ENV == "production",
  sameSite: config.NODE_ENV == "production" ? "none" : "strict",
  maxAge: 1 * 24 * 60 * 60 * 1000
}