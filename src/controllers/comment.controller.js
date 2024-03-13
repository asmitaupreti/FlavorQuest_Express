import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { recipeExist } from "./recipe.controller";

const addCommentToARecipe = asyncHandler(async (req, res, next) => {
   //get the id of the recipe  and comment string that the user wants to post
   const { recipeId, comment } = req.body;

   // get user from the request as well
   const user = req.user;

   //check if recipe id is null or empty
   if (!recipeId || !comment) {
      return next(new ApiError(400, " recipe id and comment cannot be empty"));
   }

   //Check if recipe exists
   const recipeIdValid = await recipeExist(recipeId);

   if (!recipeIdValid) {
      return next(new ApiError(400, " recipe does not exist"));
   }

   //save it to comment
   const createdComment = await Comment.create({
      recipeId,
      user: user._id,
      comment: comment,
   });

   if (!createdComment) {
      return next(new ApiError(500, "Something went wrong when commenting"));
   }
   // send response to user
   res.status(201).json(
      new ApiResponse(201, "Commented Successfully", createdComment)
   );
});

const removeCommentFromRecipe = asyncHandler(async (req, res, next) => {
   const commentId = req.params.id;
   const user = req.user;

   const userComment = await Comment.findById(commentId);
   if (!userComment) {
      return next(new ApiError(404, "Comment does not exist"));
   }

   if (!userComment.user.equals(user._id)) {
      return next(new ApiError(403, "Unauthorized to delete this comment"));
   }

   const response = await Comment.deleteOne({ _id: commentId, user: user._id });
   if (response.deletedCount === 0) {
      return next(new ApiError(404, "Comment not found or already removed"));
   }

   res.status(200).json(
      new ApiResponse(200, "Comment removed successfully", {})
   );
});

const editComment = asyncHandler(async (req, res, next) => {
   const commentId = req.params.id;

   const { comment } = req.body;
   const user = req.user;

   if (!comment) {
      return next(new ApiError(400, "comment cannot be empty"));
   }

   const existingComment = await Comment.findById(commentId);

   if (!existingComment) {
      return next(new ApiError(400, "comment does not exist"));
   }
   // Ensure the user ID matches the comment's user ID (author)
   // Assuming existingComment.user is the ID of the comment's author and needs to be converted to a string to match
   if (!existingComment.user.equals(user._id)) {
      return next(new ApiError(403, "Unauthorized to edit this comment"));
   }

   const response = await Comment.findByIdAndUpdate(
      commentId,
      {
         $set: {
            comment,
         },
      },
      { new: true }
   );
   if (!response) {
      return next(
         new ApiError(500, "Something went wrong when editing a comment")
      );
   }
   // send response to user
   res.status(200).json(
      new ApiResponse(200, "Comment Updated Successfully", response)
   );
});

const getAllCommentOfARecipe = asyncHandler(async (req, res, next) => {
   const recipeId = req.params.id;

   const comments = await Comment.find({ recipeId: recipeId });
   if (!comments) {
      return next(
         new ApiError(500, "Something went wrong when retrieving a comment")
      );
   }
   // send response to user
   res.status(200).json(
      new ApiResponse(200, "Comment retrieved Successfully", comments)
   );
});

export {
   addCommentToARecipe,
   removeCommentFromRecipe,
   editComment,
   getAllCommentOfARecipe,
};
