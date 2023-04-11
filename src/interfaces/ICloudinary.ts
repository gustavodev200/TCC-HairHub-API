export interface ICloudinaryResponse {
  imageURL?: string;
}

export interface ICloudinary {
  uploadImage: (imageToUpload: string) => Promise<ICloudinaryResponse>;
}
