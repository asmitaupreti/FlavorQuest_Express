import { Router } from "express";
import { registerUser, login } from "../controllers/user.controller.js";
import validation from "../middlewares/validation.middleware.js";
import {
   userLoginValidationSchema,
   userRegisterValidationSchema,
} from "../validations/user.validation.js";
import { upload } from "../middlewares/multer.middleware.js";

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
export default router;
