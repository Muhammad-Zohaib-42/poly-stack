import {Router} from "express"
import * as authControllers from "../controllers/auth.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJwt } from "../middlewares/auth.middlewares.js"

const router = Router()

/**
 * @route POST
 * @desc Register a new user account
 * @access public
 */
router.post("/register", upload.single("avatar"), authControllers.registerController)

/**
 * @route POST
 * @desc verify email by otp
 * @access public
 */
router.post("/verify-email", authControllers.verifyEmailController)

/**
 * @route POST
 * @desc login user
 * @access public
 */
router.post("/login", authControllers.loginController)

/**
 * @route POST
 * @desc logout user
 * @access private
 */
router.post("/logout", verifyJwt, authControllers.logoutController)

/**
 * @route POST
 * @desc logout from all devices
 * @access private
 */
router.post("/logout-all", verifyJwt, authControllers.logoutAllController)

/**
 * @route POST
 * @desc rotate the tokens
 * @access private
 */
router.post("/rotate-tokens", authControllers.rotateTokensController)

/**
 * @route GET
 * @desc provides the user data
 * @access private
 */
router.get("/get-me", verifyJwt, authControllers.getMeController)

/**
 * @route DELETE
 * @desc deletes the user account
 * @access private
 */
router.delete("/delete", verifyJwt, authControllers.deleteController)

export default router