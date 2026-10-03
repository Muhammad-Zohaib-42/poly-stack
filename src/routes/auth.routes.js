import {Router} from "express"
import * as authControllers from "../controllers/auth.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

/**
 * @route POST
 * @desc Register a new user account
 * @access Public
 */
router.post("/register", upload.single("avatar"), authControllers.registerController)

export default router