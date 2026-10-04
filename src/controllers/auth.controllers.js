import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {userModel} from "../models/user.model.js"
import {otpModel} from "../models/otp.model.js"
import {sessionModel} from "../models/session.model.js"
import { sendEmail } from "../services/email.service.js"
import { generateAccessAndRefreshTokens, getEmailHtml, getOtp } from "../utils/utils.js"
import { refreshTokenOptions } from "../constants.js"
import { uploadOnCloudinary } from "../services/cloudinary.service.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import {config} from "../config/config.js"

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
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

  await otpModel.create({otp: otpHash, email, user: user._id})
  await sendEmail(name, email, html)

  return res.status(201).json(
    new ApiResponse(201, "user registered successfully", true, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    })
  )
})

/**
 * @route POST
 * @desc verify email by otp and deletes otp and flag user as verified
 * @access public
 */
export const verifyEmailController = asyncHandler(async (req, res) => {
  const {email, otp} = req.body

  if (!email || !otp) {
    return res.status(400).json(
      new ApiResponse(400, "All fields are required", false)
    )
  }

  const otpDoc = await otpModel.findOne({email})

  if (!otpDoc) {
    return res.status(409).json(
      new ApiResponse(409, "OTP not found", false)
    )
  }

  const isOtpCorrect = otpDoc.isOtpCorrect(otp)

  if (!isOtpCorrect) {
    return res.status(409).json(
      new ApiResponse(409, "Incorrect OTP", false)
    )
  }

  await otpModel.deleteMany({email})

  const user = await userModel.findOne({email})

  if (!user) {
    return res.status(409).json(
      new ApiResponse(409, "User doesn't exist", false)
    )
  }

  user.isVerified = true
  const updatedUser = await user.save()

  const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user)
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

  await sessionModel.create({
    refreshToken: refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    user: user._id
  })

  return res.status(200).cookie("refreshToken", refreshToken, refreshTokenOptions).json(
    new ApiResponse(200, "Email verified successfully", true, {
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
        avatar: updatedUser.avatar
      },
      accessToken
    })
  )
})

/**
 * @route POST
 * @desc expect email and password and login user and creates access and refresh tokens
 * @access public
 */
export const loginController = asyncHandler(async (req, res) => {
  const {email, password} = req.body

  if (!email || !password) {
    return res.status(400).json(
      new ApiResponse(400, "All fields are required", false)
    )
  }

  const existedUser = await userModel.findOne({email})

  if (!existedUser) {
    return res.status(409).json(
      new ApiResponse(409, "User with this email doesn't exist", false)
    )
  }

  const isPasswordCorrect = await existedUser.isPasswordCorrect(password)

  if (!isPasswordCorrect) {
    return res.status(409).json(
      new ApiResponse(409, "Incorrect password", false)
    )
  }

  const {accessToken, refreshToken} = generateAccessAndRefreshTokens(existedUser)
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

  await sessionModel.create({
    refreshToken: refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    user: existedUser._id
  })

  return res.status(200).cookie("refreshToken", refreshToken, refreshTokenOptions).json(
    new ApiResponse(200, "User LoggedIn successfully", true, {
      user: {
        _id: existedUser._id,
        name: existedUser.name,
        email: existedUser.email,
        isVerified: existedUser.isVerified,
        avatar: existedUser.avatar
      },
      accessToken
    })
  )
})

/**
 * @route POST
 * @desc logout user and deletes the session from db and clears the cookie
 * @access public
 */
export const logoutController = asyncHandler(async (req, res) => {
  const {refreshToken} = req.cookies
  const {user} = req

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

  await sessionModel.findOneAndUpdate(
    {
      refreshToken: refreshTokenHash,
      user: user._id
    },
    {
      revoke: true
    }
  )

  return res.status(200).clearCookie("refreshToken", refreshTokenOptions).json(
    new ApiResponse(200, "user loggedOut successfully", true, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    })
  )
})

/**
 * @route POST
 * @desc rotate the tokens, generate access and refresh tokens and set as cookies and also update refresh token in the session that enhance security
 * @access private
 */
export const rotateTokensController = asyncHandler(async (req, res) => {
  const {refreshToken} = req.cookies

  if (!refreshToken) {
    return res.status(400).json(
      new ApiResponse(400, "refresh token is required", false)
    )
  }

  let decoded

  try {
    decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, "invalid or expired refresh token", false)
    )
  }

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
  const session = await sessionModel.findOne({refreshToken: refreshTokenHash, revoke: false})

  if (!session) {
    return res.status(401).json(
      new ApiResponse(401, "session expired", false)
    )
  }

  const user = await userModel.findById(decoded._id)

  if (!user) {
    return res.status(409).json(
      new ApiResponse(409, "user doesn't exist", false)
    )
  }

  const {accessToken, refreshToken: newRefreshToken} = generateAccessAndRefreshTokens(user)
  const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")

  await sessionModel.findOneAndUpdate(
    {
      refreshToken: refreshTokenHash,
      user: user._id
    },
    {
      refreshToken: newRefreshTokenHash
    }
  )

  return res.status(200).cookie("refreshToken", newRefreshToken, refreshTokenOptions).json(
    new ApiResponse(200, "tokens rotated successfully", true, {
      accessToken
    })
  )
})

/**
 * @route GET
 * @desc expects the access token and provide the user data
 * @access private
 */
export const getMeController = asyncHandler(async (req, res) => {
  const {user} = req

  return res.status(200).json(
    new ApiResponse(200, "fetched user data successfully", true, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar
      }
    })
  )
})

/**
 * @route POST
 * @desc logout the user from all devices
 * @access private
 */
export const logoutAllController = asyncHandler(async (req, res) => {
  const {user} = req

  await sessionModel.updateMany(
    {
      user: user._id
    },
    {
      revoke: true
    }
  )

  return res.status(200).clearCookie("refreshToken", refreshTokenOptions).json(
    new ApiResponse(200, "loggedOut from all devices successfully", true)
  )
})

/**
 * @route DELETE
 * @desc deletes the user account
 * @access private
 */
export const deleteController = asyncHandler(async (req, res) => {
  const {user} = req

  await sessionModel.deleteMany(
    {
      user: user._id
    }
  )

  await userModel.findByIdAndDelete(user._id)

  return res.status(200).clearCookie("refreshToken", refreshTokenOptions).json(
    new ApiResponse(200, "user deleted successfully", true)
  )
})