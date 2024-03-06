import { Router } from "express";
import {
   registerUser,
   login,
   logout,
   refreshAccessToken,
} from "../controllers/user.controller.js";
import validation from "../middlewares/validation.middleware.js";
import {
   userLoginValidationSchema,
   userRegisterValidationSchema,
} from "../validations/user.validation.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
   upload.fields([
      {
         name: "avatar",
         maxCount: 1,
      },
      {
         name: "coverImage",
         maxCount: 1,
      },
   ]),
   validation(userRegisterValidationSchema),
   registerUser
);

router.route("/login").post(validation(userLoginValidationSchema), login);
router.route("/refreshToken").post(refreshAccessToken);

//secured routes
router.route("/logout").post(verifyJwt, logout);

export default router;
