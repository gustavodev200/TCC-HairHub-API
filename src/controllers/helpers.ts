import { HttpResponse, HttpStatusCode } from "./protocols";

export const responseSuccess = <T>(body: any): HttpResponse<T> => {
  return {
    statusCode: HttpStatusCode.OK,
    body,
  };
};
