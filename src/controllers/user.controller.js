import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
   deleteFromCloudinary,
   uploadOnCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
   try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;

      user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   } catch (error) {
      return next(new ApiError(500, error?.message));
   }
};

const registerUser = asyncHandler(async (req, res, next) => {
   //get username, fullname, email, password  from request

   const { username, fullName, email, password } = req.body;
   // validation not empty {if yup is wprking this is handled by yup}
   //check if user already exist: username, email
   const existedUser = await User.findOne({
      $or: [{ email }, { username }],
   });

   if (existedUser) {
      return next(new ApiError(409, "username or email already exist"));
   }
   //check for images, check for aavatar
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path ?? null;

   if (!avatarLocalPath) {
      return next(new ApiError(400, "avatar file is required"));
   }

   //upload them to cloudinary, avatar upload url avaiable or not
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   console.log(avatar, "#################");
   let cover_image = null;
   if (!coverImageLocalPath) {
      cover_image = await uploadOnCloudinary(coverImageLocalPath);
   }

   if (!avatar) {
      return next(new ApiError(400, "avatar file is required"));
   }

   //create user object- Create entry in db
   const user = await User.create({
      username: username.toLowerCase(),
      fullName,
      email,
      avatar: {
         imageUrl: avatar.url,
         imagePublicId: avatar.public_id,
      },
      coverImage: cover_image
         ? {
              imageUrl: cover_image?.url || "",
              imagePublicId: cover_image?.public_id || "",
           }
         : null,
      password,
   });

   //check if user is created or not
   //send response excluding password  and refresh token
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   if (!createdUser) {
      return next(
         new ApiError(500, "Something went wrong when registering the user")
      );
   }

   res.status(201).json(
      new ApiResponse(200, "User Created successfully", createdUser)
   );
});

const login = asyncHandler(async (req, res, next) => {
   // get data
   const { username, password } = req.body;
   //validate is empty but in our case it is done by yup middleware
   //find user
   const user = await User.findOne({
      $or: [{ username }],
   });
   if (!user) {
      return next(new ApiError(404, "User doesnot exist"));
   }
   //check password
   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
      return next(new ApiError(400, "Wrong password"));
   }
   //create access token and refresh token
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
   );
   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   // send cookie
   const options = {
      httpOnly: true,
      secure: true,
   };

   // send response
   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(200, "User logged In Successfully", {
            user: loggedInUser,
            accessToken,
            refreshToken,
         })
      );
});

const logout = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1, // this removes the field from document
         },
      },
      {
         new: true,
      }
   );

   const options = {
      httpOnly: true,
      secure: true,
   };

   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "User logged Out", {}));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
   const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

   if (!refreshToken) {
      return next(new ApiError(401, "Unauthorized request"));
   }
   const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
   );
   if (!decodedRefreshToken) {
      return next(new ApiError(401, "Unauthorized request"));
   }

   const user = await User.findById(decodedRefreshToken._id);
   if (!user) {
      return next(new ApiError(401, "Invalid refresh token"));
   }

   if (incomingRefreshToken !== user?.refreshToken) {
      return next(new ApiError(401, "Refresh token is invalid or used"));
   }
   const { accessToken, refreshAccessToken } =
      await generateAccessAndRefreshToken(user._id);
   // send cookie
   const options = {
      httpOnly: true,
      secure: true,
   };

   // send response
   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshAccessToken, options)
      .json(
         new ApiResponse(200, "Access Token refreshed Successfully", {
            accessToken,
            refreshToken: refreshAccessToken,
         })
      );
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
   // get old password new password confirm password
   const { oldPassword, newPassword, confirmPassword } = req.body;
   // get user with user id
   const user = User.findById(req.user?._id);
   // check if the existing user has the password as old password
   const isPasswordValid = user.isPasswordCorrect(oldPassword);
   if (!isPasswordValid) {
      return next(new ApiError(400, "Invalid old password"));
   }
   // set password to new password
   user.password = newPassword;
   // save to data
   user.save({ validateBeforeSave: false });
   //send response
   res.status(200).json(
      new ApiResponse(200, "Password changed successfully", {})
   );
});

const currentUser = asyncHandler(async (req, res, next) => {
   //get current user from req.user
   const user = req.user;
   if (!user) {
      return next(new ApiError(400, "Invalid access token"));
   }
   //send response
   res.status(200).json(
      new ApiResponse(200, "Password changed successfully", user)
   );
});

const updateAccountDetail = asyncHandler(async (req, res, next) => {
   // get data from req
   const { fullName, email } = req.body;
   //validate data
   if (!fullName && !email) {
      return next(new ApiError(400, "All fields are required"));
   }
   // save it in database
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            fullName,
            email: email,
         },
      },
      { new: true }
   ).select("-password");

   //send back response
   return res
      .status(200)
      .json(new ApiResponse(200, "Account details updated successfully", user));
});

const updateAvatar = asyncHandler(async (req, res, next) => {
   //get image from req.file
   const avatarLocalImagePath = req.file?.path;

   // validate the image
   if (!avatarLocalImagePath) {
      return next(new ApiError(400, "Avatar file is missing"));
   }
   // upload the image to cloudinary
   const uploadResponse = await uploadOnCloudinary(avatarLocalImagePath);
   if (!uploadResponse.url) {
      return next(new ApiError(400, "Error while uploading on avatar"));
   }
   // update the avatar data with new cloudinary image data
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: {
               imageUrl: uploadResponse.url,
               imagePublicId: uploadResponse.public_id,
            },
         },
      },
      { new: true }
   ).select("-password");
   if (!user) {
      return next(
         new ApiError(
            500,
            "Something went wrong when updating the avatar image"
         )
      );
   }
   // delete the old image from cloudinary
   const deleteResponse = await deleteFromCloudinary(user.avatar.imagePublicId);
   if (!deleteResponse) {
      return next(
         new ApiError(
            500,
            "Something went wrong when updating the avatar image"
         )
      );
   }

   // send response
   res.status(200).json(
      new ApiResponse(200, "Avatar image updated successfully", user)
   );
});

const updateCoverImage = asyncHandler(async (req, res, next) => {
   //get image from req.file
   const coverImageLocalImagePath = req.file?.path;

   // validate the image
   if (!coverImageLocalImagePath) {
      return next(new ApiError(400, "Cover Image file is missing"));
   }
   // upload the image to cloudinary
   const uploadResponse = await uploadOnCloudinary(coverImageLocalImagePath);
   if (!uploadResponse.url) {
      return next(new ApiError(400, "Error while uploading on cover image"));
   }
   // update the avatar data with new cloudinary image data
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            coverImage: {
               imageUrl: uploadResponse.url,
               imagePublicId: uploadResponse.public_id,
            },
         },
      },
      { new: true }
   ).select("-password");
   if (!user) {
      return next(
         new ApiError(500, "Something went wrong when updating the cover image")
      );
   }
   // delete the old image from cloudinary
   const deleteResponse = await deleteFromCloudinary(
      user.coverImage.imagePublicId
   );
   if (!deleteResponse) {
      return next(
         new ApiError(500, "Something went wrong when updating the cover image")
      );
   }

   // send response
   res.status(200).json(
      new ApiResponse(200, "Cover image updated successfully", user)
   );
});
export {
   registerUser,
   login,
   logout,
   refreshAccessToken,
   changeCurrentPassword,
   currentUser,
   updateAccountDetail,
   updateAvatar,
   updateCoverImage,
};
