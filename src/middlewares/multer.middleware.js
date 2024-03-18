import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// __dirname is not defined in ES6 modules, so you need to create it

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/temp/"));
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   },
});

export const upload = multer({ storage: storage });
