import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async (req, res) => {
   res.status(200).json(new ApiResponse(200, "ok"));
});

export { registerUser };
