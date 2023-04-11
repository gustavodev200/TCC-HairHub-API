import { v2 as cloudinary } from "cloudinary";
import { ICloudinary, ICloudinaryResponse } from "../interfaces";
import { unlinkSync } from "fs";
import { AppError } from "../errors/AppError";

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

        throw new AppError(
          "Não foi possível enviar sua imagem no momento. Por favor, tente novamente mais tarde."
        );
      }

      unlinkSync(imageToUpload);
      return {
        imageURL: url,
      };
    } catch (error) {
      unlinkSync(imageToUpload);
      throw new AppError(
        "Erro interno no Servidor! Tente novamente mais tarde."
      );
    }
  };
}

//  uploads = (file: string, folder: any) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(
//       file,
//       (result) => {
//         resolve({
//           url: result.url,
//           id: result.public_id,
//         });
//       },
//       {
//         resource_type: "auto",
//         folder,
//       }
//     );
//   });
// };
