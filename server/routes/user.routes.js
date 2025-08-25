import {Router} from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT} from "../middlewares/auth.middleware.js"



const router = Router()

router
.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: "1"
        },
        {
            name: "coverImage",
            maxCount: 2
        }
    ]),
    registerUser)

router
.route("/login").post(loginUser)
//secured routes


export default router;