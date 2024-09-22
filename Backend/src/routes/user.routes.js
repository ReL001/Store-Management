import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";

const router = Router()  //create a new router object using the Router() function from the express module.

//register route for user registration
router.route("/register").post(
    upload.fields([  //using multer middleware to upload files and store them in the public/temp directory
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)  

export default router