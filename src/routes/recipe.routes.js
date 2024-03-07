import { Router } from "express";
import {
   recipeByIngredient,
   recipeDetail,
   recipes,
} from "../controllers/recipe.controller";

const router = Router();

router.route("/").get(recipes);
router.route("/recipe-by-ingredient").get(recipeByIngredient);
router.route("/recipe-detail/:id").get(recipeDetail);

export default router;
