import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
   //get username, fullname, email, password  from request
   const { username, fullName, email, password } = req.body;
   // validation not empty {if yup is wprking this is handled by yup}
   //check if user already exist: username, email
   const existedUser = User.findOne({
      $or: [{ email }, { username }],
   });

   if (existedUser) {
      next(new ApiError(409, "username or email already exist"));
   }
   //check for images, check for aavatar
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalPath) {
      next(new ApiError(400, "avatar file is required"));
   }

   //upload them to cloudinary, avatar upload url avaiable or not
   const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
   const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);

   if (!avatarUrl) {
      next(new ApiError(400, "avatar file is required"));
   }

   //create user object- Create entry in db
   const user = await User.create({
      username: username.toLowerCase(),
      fullName,
      email,
      avatar: avatarUrl,
      coverImage: coverImageUrl || "",
      password,
   });

   //check if user is created or not
   //send response excluding password  and refresh token
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   if (!createdUser) {
      next(new ApiError(500, "Something went wrong when registering the user"));
   }

   res.status(201).json(
      new ApiResponse(200, "User Created successfully", createdUser)
   );
});

const login = asyncHandler(async (req, res) => {
   res.status(200).json(new ApiResponse(200, "ok"));
});

export { registerUser, login };
