import { ApiError } from "../utils/ApiError.js";

const globalErrorHandler = (error, req, res, next) => {
   error.statusCode = error.statusCode || 500;
   error.status = error.status || "error";
   res.status(error.statusCode).json(
      new ApiError(error.statusCode, error.message)
   );
};

export { globalErrorHandler };
