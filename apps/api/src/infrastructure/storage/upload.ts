import path from "node:path";
import multer from "multer";
import { env } from "../config/environment.js";

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, path.resolve(env.UPLOAD_DIRECTORY));
  },
  filename: (_request, file, callback) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

