import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import * as articleControllers from "../controllers/article.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router()

/**
 * @route POST
 * @desc create a new article
 * @access private
 */
router.post("/create", verifyJwt, upload.array("images", 3), articleControllers.createController)

/**
 * @route GET
 * @desc get article
 * @access private
 */
router.get("/get/:id", verifyJwt, articleControllers.getController)

/**
 * @route PATCH
 * @desc updates the article with provided data from req body
 * @access private
 */
router.get("/update/:id", verifyJwt, articleControllers.getController)

export default router