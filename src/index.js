import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT;

app.get("/", (_, res) => {
   res.send("Hello world asmita upreti test");
});

app.listen(PORT, () => {
   console.log(`server is listening at port ${PORT}`);
});
