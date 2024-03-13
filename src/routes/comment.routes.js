import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
   addCommentToARecipe,
   editComment,
   getAllCommentOfARecipe,
   removeCommentFromRecipe,
} from "../controllers/comment.controller";

const router = Router();
router.route("/:id").get(getAllCommentOfARecipe);
router.route("/add-comment").post(verifyJwt, addCommentToARecipe);
router.route("/edit-comment/:id").patch(verifyJwt, editComment);
router.route("/remove-comment/:id").delete(verifyJwt, removeCommentFromRecipe);
export default router;
