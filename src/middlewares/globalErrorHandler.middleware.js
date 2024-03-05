import { ApiError } from "../utils/ApiError.js";

const globalErrorHandler = (error, _, res, _) => {
   error.statusCode = error.statusCode || 500;
   error.status = error.status || "error";
   res.status(error.statusCode).json(
      new ApiError(error.statusCode, error.message)
   );
};

export { globalErrorHandler };
