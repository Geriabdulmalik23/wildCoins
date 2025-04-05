// export const createResponse = (success : boolean, message : string, data : any, statusCode = 200) => {
//     return {
//       success,
//       message,
//       data,
//       statusCode
//     };
//   };

  // export const createResponse = (status : boolean, message : string, data = {}, meta = {}) => ({
  //   status,
  //   message,
  //   data,
  //   meta: {
  //     timestamp: new Date().toISOString(),
  //     ...meta
  //   }
  // });

//Pesan Jika Error
// throw new Error('Produk tidak ditemukan')

  export const createResponse = (
    success: boolean,
    message: string,
    data: any = null,
    errors: any = null,
    meta: any = {},
    code?: string
  ) => ({
    success,
    message,
    data,
    errors,
    ...(code && { code }),
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  })