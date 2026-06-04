
// export interface NormalizedError {
//   statusCode: number;
//   message: string;
//   code: string;
// }

// export function normalizePrismaError(
//   error: any,
//   lang: Language = "fr"
// ): NormalizedError {
//   const prismaCode = error?.code;

//   if (prismaCode && PRISMA_ERRORS [prismaCode]) {
//     return {
//       statusCode: 400,
//       code: prismaCode,
//       message: PRISMA_ERRORS[prismaCode].message[lang],
//     };
//   }

//   return {
//     statusCode: 500,
//     code: "default",
//     message: PRISMA_ERRORS["default"].message[lang],
//   };
// }
