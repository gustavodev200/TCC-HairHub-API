import { Status } from "../dtos/ServiceDTO";

export interface HttpResponse<T> {
  statusCode: HttpStatusCode;
  body: T;
}

export interface HttpRequest<B> {
  params?: any;
  headers?: any;
  body?: B;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
}

export interface IController {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;
}

export const userStatusToBoolean = (status: Status): boolean => {
  switch (status) {
    case Status.Ativo:
      return true;
    case Status.Inativo:
      return false;
    default:
      throw new Error(`Status ${status} inválido`);
  }
};

export const booleanToUserStatus = (status: boolean): Status => {
  return status ? Status.Ativo : Status.Inativo;
};
