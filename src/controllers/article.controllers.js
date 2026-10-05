import { articleModel } from "../models/article.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../services/cloudinary.service.js"

/**
 * @route POST
 * @desc expects title and description and creates a article
 * @access private
 */
export const createController = asyncHandler(async (req, res) => {
  const {title, description} = req.body
  const {files} = req
  const {user} = req

  if (!title || !description) {
    return res.status(400).json(
      new ApiResponse(400, "All fields are required", false)
    )
  }

  const results = await Promise.allSettled(
    files.map(file => uploadOnCloudinary(file.path))
  )

  const images = results.filter(file => file.status !== "rejected").map(file => file.value)

  const article = await articleModel.create({
    images,
    title,
    description,
    user: user._id
  })

  return res.status(201).json(
    new ApiResponse(201, "Article created successfully", true, {
      article: {
        _id: article._id,
        images: article.images,
        title: article.title,
        description: article.description
      }
    })
  )
})

/**
 * @route GET
 * @desc expects article id and returns article
 * @access private
 */
export const getController = asyncHandler(async (req, res) => {
  const {id} = req.params

  if (!id) {
    return res.status(400).json(
      new ApiResponse(400, "Article id is required", false)
    )
  }

  const article = await articleModel.findById(id)

  return res.status(200).json(
    new ApiResponse(200, "Article fetched successfully", true, {
      article: {
        _id: article._id,
        images: article.images,
        title: article.title,
        description: article.description
      }
    })
  )
})

/**
 * @route PATCH
 * @desc update the article
 * @access private
 */
export const updateController = asyncHandler(async (req, res) => {
  const {id} = req.params

  if (!id) {
    return res.status(400).json(
      new ApiResponse(400, "Article id is required", false)
    )
  }

  const updatedData = {
    title: req.body.title && req.body.title,
    description: req.body.description && req.body.description
  }
})