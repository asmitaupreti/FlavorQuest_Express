import { Router } from "express";
import {
   registerUser,
   login,
   logout,
   refreshAccessToken,
   changeCurrentPassword,
   currentUser,
   updateAvatar,
   updateCoverImage,
   updateAccountDetail,
} from "../controllers/user.controller.js";
import validation from "../middlewares/validation.middleware.js";
import {
   changeUserPasswordValidation,
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
router.route("/refresh-token").post(refreshAccessToken);

//secured routes
router
   .route("/change-password")
   .post(
      validation(changeUserPasswordValidation),
      verifyJwt,
      changeCurrentPassword
   );
router.route("/current-user").get(verifyJwt, currentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetail);
router.route("/logout").post(verifyJwt, logout);
router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar);
router
   .route("/cover-image")
   .patch(verifyJwt, upload.single("coverImage"), updateCoverImage);

export default router;
