import { Request, Response } from "express";
import { EmployeeService } from "../../../services/user/EmployeeService";
import { AppError, ErrorMessages } from "../../../errors";
import { Cloudinary } from "../../../utils";
import { prismaClient } from "../../../models";
import { EmployeeInputDTO } from "../../../models/dtos";

export class CreateEmployeeController {
  public async handle(req: Request, res: Response) {
    let data = req.body;
    // const localFilePath = req.file?.path;

    // if (!localFilePath) {
    //   throw new AppError(ErrorMessages.MSGE06);
    // }

    // const cloudinaryInstance = new Cloudinary();

    // const alreadyExists = await prisma.employee.findUnique({
    //   where: { cpf: data.cpf },
    // });

    // if (alreadyExists) {
    //   throw new AppError(ErrorMessages.MSGE02, 404);
    // }

    // const { imageURL } = await cloudinaryInstance.uploadImage(
    //   localFilePath,
    //   "services"
    // );

    const employeeService = new EmployeeService();

    // data.image = imageURL as string;

    const result = await employeeService.create(data);

    return res.status(201).json(result);
  }
}

export default new CreateEmployeeController();
