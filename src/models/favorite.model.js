import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const favoriteSchema = new Schema(
   {
      recipeId: {
         type: String,
         required: true,
      },
      user: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
   },
   {
      timestamps: true,
   }
);

favoriteSchema.plugin(mongooseAggregatePaginate);
export const Favorite = mongoose.model("Favorite", favoriteSchema);
