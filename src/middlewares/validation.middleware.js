import { ApiError } from "../utils/ApiError.js";

const validation = (schema) => async (req, res, next) => {
   const body = req.body;
   try {
      await schema.validate(body);
      next();
   } catch (error) {
      res.status(400).json(
         new ApiError(error.statusCode, error.message, error?.errors)
      );
      // next(new ApiError(error.statusCode, error.message, error?.errors));
   }
};

export default validation;
