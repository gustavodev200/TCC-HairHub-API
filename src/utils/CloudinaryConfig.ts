import { v2 as cloudinary } from "cloudinary";
import { ICloudinary, ICloudinaryResponse } from "../interfaces";
import { unlinkSync } from "fs";
import { AppError, ErrorMessages } from "../errors";

export class Cloudinary implements ICloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    });
  }
  public uploadImage = async (
    imageToUpload: string
  ): Promise<ICloudinaryResponse> => {
    try {
      const cloudinaryImageUploadResponse = await cloudinary.uploader.upload(
        imageToUpload,
        {
          public_id: process.env.CLOUDINARY_CLOUD_NAME,
        }
      );

      const { url } = cloudinaryImageUploadResponse;

      if (!url) {
        unlinkSync(imageToUpload);

        throw new AppError(ErrorMessages.MSGE12);
      }

      unlinkSync(imageToUpload);
      return {
        imageURL: url,
      };
    } catch (error) {
      unlinkSync(imageToUpload);
      throw new AppError(ErrorMessages.MSGE03);
    }
  };
}

export class UpdateNewImage {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    });
  }

  public newImageUpload = async (
    newImagePath: string,
    publicIdImageOld?: string
  ) => {
    try {
      const cloudinaryImageUploadResponse = await cloudinary.uploader.upload(
        newImagePath,
        {
          public_id: process.env.CLOUDINARY_CLOUD_NAME,
        }
      );

      const { url, public_id } = cloudinaryImageUploadResponse;

      if (!url) {
        unlinkSync(newImagePath);

        throw new AppError(ErrorMessages.MSGE12);
      }

      if (public_id && publicIdImageOld) {
        await cloudinary.uploader.destroy(publicIdImageOld as string);
      }

      unlinkSync(newImagePath);
      return {
        imageURL: url,
      };
    } catch (error) {
      unlinkSync(newImagePath);
      throw new AppError(ErrorMessages.MSGE03);
    }
  };
}
