import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const base_url = process.env.SPOONACULAR_BASE_URL;
const recipe_api_key = process.env.SPOONACULAR_API_KEY;

const getRecipes = asyncHandler(async (req, res, next) => {
   const { query, limit = 10, page = 0 } = req.query;
   const response = await axios.get(
      `${base_url}/complexSearch?apiKey=${recipe_api_key}&offset=${page * limit}$query=${query}&number=${limit}`
   );
   if (!response) {
      return next(
         new ApiError(500, "Something went wrong when retrieving recipes")
      );
   }

   res.status(200).json(new ApiResponse(200, "Success", response));
});

const getRecipeByIngredient = asyncHandler(async (req, res, next) => {
   const { ingredients, limit = 10 } = req.query;
   const response = await axios.get(
      `${base_url}/findByIngredients?apiKey=${recipe_api_key}&ingredients=${ingredients}&number=${limit}ignorePantry=false`
   );
   if (!response) {
      return next(
         new ApiError(
            500,
            "Something went wrong when retrieving recipes based on ingredients"
         )
      );
   }

   res.status(200).json(
      new ApiResponse(200, "Success", {
         results: response,
      })
   );
});

const recipeExist = async (id, includeNutrition = true) => {
   const response = await axios.get(
      `${base_url}/informationBulk?apiKey=${recipe_api_key}&ids=${id}&includeNutrition=${includeNutrition}`
   );

   return response;
};

const getRecipeDetail = asyncHandler(async (req, res, next) => {
   const id = req.params?.id;
   const response = await recipeExist(id);
   // const response = await axios.get(
   //    `${base_url}/informationBulk?apiKey=${recipe_api_key}&ids=${id}&includeNutrition=true`
   // );
   if (!response) {
      return next(
         new ApiError(500, "Something went wrong when retrieving recipe detail")
      );
   }

   res.status(200).json(
      new ApiResponse(200, "Success", {
         results: response[0],
      })
   );
});

export { recipeExist, getRecipes, getRecipeByIngredient, getRecipeDetail };
