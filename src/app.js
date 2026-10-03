import express from "express"
import ApiResponse from "./utils/ApiResponse.js"

const app = express()

app.use((error, _, res, _) => {
  const status = error.statusCode || 500
  const message = error.message || "Internal server error"

  return res.status(status).json(
    new ApiResponse(status, message, false)
  )
})

export {app}