import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const validateEmail = function (email) {
   const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   return regex.test(email);
};

const imageScheme = new Schema({
   imageUrl: {
      type: String, // cloudinary url
   },
   imagePublicId: {
      type: String, // cloudinary public id
   },
});

const userSchema = new Schema(
   {
      username: {
         type: String,
         required: [true, "Username is required"],
         unique: true,
         lowercase: true,
         trim: true,
         index: true,
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         lowercase: true,
         trim: true,
         validate: [validateEmail, "Please fill a valid email address"],
      },
      fullName: {
         type: String,
         required: [true, "FullName is required"],
         trim: true,
         index: true,
      },

      avatar: {
         type: imageScheme, // cloudinary url
         required: true,
      },

      coverImage: {
         type: imageScheme, // cloudinary url
      },

      password: {
         type: String,
         required: [true, "Password is required"],
      },
      refreshToken: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
);
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
   return jwt.sign(
      {
         _id: this.id,
         email: this.email,
         username: this.username,
         fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
};

userSchema.methods.generateRefreshToken = async function () {
   return jwt.sign(
      {
         _id: this.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
   );
};

export const User = mongoose.model("User", userSchema);
