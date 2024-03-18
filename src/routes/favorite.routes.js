import { Router } from "express";
import {
   addRecipeAsFavorite,
   getAllFavoriteRecipe,
   removeRecipeFromFavorite,
} from "../controllers/favorite.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJwt, getAllFavoriteRecipe);
router.route("/add-favorite").post(verifyJwt, addRecipeAsFavorite);
router
   .route("/remove-favorite/:id")
   .delete(verifyJwt, removeRecipeFromFavorite);
export default router;
