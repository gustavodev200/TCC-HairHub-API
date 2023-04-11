import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

export class UploadImage {
  private URL: string = path.basename("uploads");

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
        return cb(
          new Error("Por favor, envie apenas arquivo: jpg, png e jpeg")
        );
      }

      cb(null, false);
    };
  }

  get getConfig(): multer.Options {
    return {
      storage: this.storage(),
      fileFilter: this.fileFilter(),
    };
  }
}

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "src/uploads");
//   },

//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (!file.originalname.match(/\.(png|jpg)$/)) {
//     return cb(new Error("Por favor, envie apenas jpg ou png!"));
//   }
//   cb(undefined, true);
// };

// export const upload = multer({
//   storage,
//   fileFilter,
// });
