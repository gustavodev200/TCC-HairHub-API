// import { prisma } from "../index";

// interface PaginationResponse<T> {
//   items: T[];
//   totalCount: number;
//   pageCount: number;
//   currentPage: number;
// }

// export class MysqlGetAllServicesModel<T extends keyof typeof prisma> {
//   private model: T;

//   constructor(model: T) {
//     this.model = model;
//   }
//   public async getPerPagination(
//     page: number,
//     perPage: number
//   ): Promise<PaginationResponse<typeof prisma[T]>> {
//     const items = await prisma[this.model].findMany({
//       skip: (page - 1) * perPage,
//       take: perPage,
//     });

//     const totalCount = await prisma[this.model].count();
//     const pageCount = Math.ceil(totalCount / perPage);

//     return {
//       items,
//       totalCount,
//       pageCount,
//       currentPage: page,
//     };
//   }
// }
