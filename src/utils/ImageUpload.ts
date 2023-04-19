import multer from "multer";
import path from "path";
import * as fs from "fs";
import { Request } from "express";
import { ErrorMessages } from "../errors";

export class UploadImage {
  private URL: string = path.join(__dirname, "../uploads");

  constructor() {}

  private storage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(this.URL)) {
          fs.mkdirSync(this.URL);
        }
        cb(null, this.URL);
      },

      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });
  }

  private fileFilter() {
    return (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        return cb(new Error(ErrorMessages.MSGE13));
      }

      cb(null, true);
    };
  }

  get getConfig() {
    return {
      storage: this.storage(),
      fileFilter: this.fileFilter(),
    };
  }
}
