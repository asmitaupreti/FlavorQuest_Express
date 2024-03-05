import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
   {
      recipeId: {
         type: String,
         required: true,
      },
      comment: {
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
commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);
