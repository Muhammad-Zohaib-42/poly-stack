import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {userModel} from "../models/user.model.js"
import {otpModel} from "../models/otp.model.js"
import { sendEmail } from "../services/email.service.js"
import { generateAccessAndRefreshTokens, getEmailHtml, getOtp } from "../utils/utils.js"
import { refreshTokenOptions } from "../constants.js"
import { uploadOnCloudinary } from "../services/cloudinary.service.js"

/**
 * @route POST
 * @desc Handle new user registration, checks required data, validate data, checks the existed user, hash the password, creates the tokens and set in cookie and finally creates the User account
 * @access PUBLIC
 */
export const registerController = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body
  const {file} = req

  if (!name || !email || !password || !file) {
    return res.status(400).json( 
      new ApiResponse(400, "All fields are required", false)
    )
  }

  const existedUser = await userModel.findOne({
    $or: [{name}, {email}]
  })

  if (existedUser) {
    return res.status(409).json(
      new ApiResponse(409, "User with this name or email already exist", false)
    )
  }

  const avatar = await uploadOnCloudinary(file.path)

  const user = await userModel.create({name, email, password, avatar})

  const otp = getOtp()
  const html = getEmailHtml(name, otp)

  await otpModel.create({otp, email, user: user._id})
  await sendEmail(name, email, html)

  const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user)

  return res.status(201).cookie("refreshToken", refreshToken, refreshTokenOptions).json(
    new ApiResponse(201, "user registered successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      },
      accessToken
    }, true)
  )
})