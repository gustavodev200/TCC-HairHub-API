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

        throw new AppError(
          "Não foi possível enviar sua imagem no momento. Por favor, tente novamente mais tarde."
        );
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
      throw new AppError(
        "Erro interno no Servidor! Tente novamente mais tarde."
      );
    }
  };

  // async newImageUpload(newImagePath: string, publicIdImageOld?: string) {
  //   // Faz o upload da nova imagem para o Cloudinary
  //   const resultadoUpload = await cloudinary.uploader.upload(newImagePath);

  //   // Obtém o public_id da nova imagem
  //   const publicIdNewImage = resultadoUpload.public_id;

  //   // Se houver uma imagem antiga, apaga a imagem antiga
  //   if (publicIdNewImage) {
  //     await cloudinary.uploader.destroy(publicIdImageOld as string);
  //   }

  //   // Retorna o public_id da nova imagem
  //   return publicIdNewImage;
  // }
}
