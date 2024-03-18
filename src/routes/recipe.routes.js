import { Router } from "express";
import {
   getRecipeByIngredient,
   getRecipeDetail,
   getRecipes,
} from "../controllers/recipe.controller.js";

const router = Router();

router.route("/").get(getRecipes);
router.route("/recipe-by-ingredient").get(getRecipeByIngredient);
router.route("/recipe-detail/:id").get(getRecipeDetail);

export default router;
