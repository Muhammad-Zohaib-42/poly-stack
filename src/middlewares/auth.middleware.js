import { config } from "../config/config.js"
import { userModel } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

export async function verifyJwt(req, res, next) {
  const accessToken = req.headers["authorization"].split(" ")[1]

  if (!accessToken) {
    return res.status(401).json(
      new ApiResponse(401, "access token is required", false)
    )
  }

  let decoded

  try {
    decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET)
  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, "invalid or expired access token", false)
    )
  }

  const user = await userModel.findById(decoded._id)
  
  if (!user) {
    return res.status(401).json(
      new ApiResponse(401, "user not found", false)
    )
  }

  req.user = user
  next()
}