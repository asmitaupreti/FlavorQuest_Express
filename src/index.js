import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { httpServer } from "./utils/websocketHandler.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
   app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
   });
   httpServer.listen(PORT, () => {
      console.log(`server is listening at port ${PORT}`);
   });
});
