import { Request, Response } from "express";
import { Cloudinary } from "../../../utils";

export class UploadImageController {
  async handle(req: Request, res: Response) {
    const localFilePath = req.file?.path;

    const cloudinaryInstance = new Cloudinary();

    const { imageURL } = await cloudinaryInstance.uploadImage(localFilePath!);

    return res.status(201).json({
      imageURL,
    });
  }
}
