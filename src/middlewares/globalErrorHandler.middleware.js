import { ApiError } from "../utils/ApiError.js";

const globalErrorHandler = (error, req, res, next) => {
   error.statusCode = error.statusCode || 500;
   error.status = error.status || "error";

   // Construct the response directly from the error properties
   const errorResponse = {
      statusCode: error.statusCode,
      message: error.message,
      success: error.success || false,
      stackTrace: error.stackTrace,
   };
   // Conditionally add errors if it's not empty
   if (error.errors && error.errors.length > 0) {
      errorResponse.errors = error.errors;
   }

   res.status(error.statusCode).json(errorResponse);
};

export { globalErrorHandler };
