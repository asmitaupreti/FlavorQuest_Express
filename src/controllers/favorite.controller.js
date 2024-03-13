import { Favorite } from "../models/favorite.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { recipeExist } from "./recipe.controller";

const addRecipeAsFavorite = asyncHandler(async (req, res, next) => {
   //get the id of the recipe the user wants to save as favourite
   const { recipeId } = req.body;

   // get user from the request as well
   const user = req.user;

   //check if recipe id is null or empty
   if (!recipeId) {
      return next(new ApiError(400, " recipe id cannot be empty"));
   }

   //Check if recipe exists
   const recipeIdValid = await recipeExist(recipeId);

   if (!recipeIdValid) {
      return next(new ApiError(400, " recipe doesnot exist"));
   }
   //Check if a Recipe is Already Favorited

   const existingFavorite = await Favorite.findOne({
      recipeId: recipeId,
      user: user._id,
   });
   if (existingFavorite) {
      return next(
         new ApiError(400, "This recipe has already been saved to favorite")
      );
   }
   //save it to favorite
   const createdFavorite = await Favorite.create({
      recipeId,
      user: user._id,
   });

   if (!createdFavorite) {
      return next(
         new ApiError(
            500,
            "Something went wrong when adding recipe as favorite"
         )
      );
   }
   // send response to user
   res.status(201).json(
      new ApiResponse(201, "Saved to favorite Successfully", createdFavorite)
   );
});

const removeRecipeFromFavorite = asyncHandler(async (req, res, next) => {
   // get recipe id from param
   const recipeId = req.params._id;

   // get user from the request as well
   const user = req.user;

   //check if recipe id is null or empty
   if (!recipeId) {
      return next(new ApiError(400, " recipe id cannot be empty"));
   }

   //Check if recipe exists
   const recipeIdValid = await recipeExist(recipeId);

   if (!recipeIdValid) {
      return next(new ApiError(400, " recipe doesnot exist"));
   }

   //find the favorite record
   const favorite = await Favorite.findOne({
      recipeId: recipeId,
      user: user._id,
   });

   if (!favorite) {
      return next(
         new ApiError(400, "This recipe has not been saved to favorite")
      );
   }

   //delete the recipe from favorite
   const response = await Favorite.deleteOne({
      recipeId: recipeId,
      user: user._id,
   });
   if (!response) {
      return next(
         new ApiError(
            500,
            "Something went wrong when removing recipe from favorite"
         )
      );
   }
   // send response to user
   res.status(200).json(
      new ApiResponse(200, "Removed from favorite Successfully", {})
   );
});

const getAllFavoriteRecipe = asyncHandler(async (req, res, next) => {
   //get list of recipeId based on user
   const user = req.user;
   const recipe_Ids = await Favorite.find({ user: user?._id });
   console.log(recipe_Ids, "recipe_Ids");
   //convert array of Ids into comman separated values
   //get information for all the recipe id
   const recipesInformation = await recipeExist(recipe_Ids.join(", "));

   //prepare res object to send back to user
   const response = {
      results: recipesInformation.map((item) => {
         return {
            id: item.id,
            title: item.title,
            image: item.image,
            imageType: item.imageType,
         };
      }),
   };

   // send response to user
   res.status(200).json(
      new ApiResponse(
         200,
         "Favorite recipe list of a user retrieved successfully",
         response
      )
   );
});

export { addRecipeAsFavorite, removeRecipeFromFavorite, getAllFavoriteRecipe };
