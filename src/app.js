import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware.js";
import morgan from "morgan";
import sanitize from "express-mongo-sanitize"; // package use to sanitize sql injection from user input

const app = express();
app.use(
   cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
   })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(morgan("dev"));
app.use(sanitize());

app.use(globalErrorHandler);

//routes
import userRouter from "./routes/user.routes.js";
import favoriteRouter from "./routes/favorite.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import commentRouter from "./routes/comment.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/comments", commentRouter);

export { app };
