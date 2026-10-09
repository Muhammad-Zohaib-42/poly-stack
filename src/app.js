import express from "express"
import {ApiResponse} from "./utils/ApiResponse.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { config } from "./config/config.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: config.ORIGIN, credentials: true}))

app.use((error, _, res, next) => {
  const status = error.statusCode || 500
  const message = error.message || "Internal server error"

  return res.status(status).json(
    new ApiResponse(status, message, false)
  )
})

// importing routes
import authRoutes from "./routes/auth.routes.js"
import articleRoutes from "./routes/article.routes.js"

// declaring routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/article", articleRoutes)

export {app}