import { Claims } from '../infrastructure/authentication'

declare module 'express' {
  interface Request {
    claims: Claims
    //claims: any
}
}

// declare namespace Express {
//   interface Request {
//       claims: IClaims
//       //claims: any
//   }
// }

//export Express.Request
