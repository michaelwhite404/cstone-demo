declare namespace Express {
  export interface Request {
    /** Time of the request */
    requestTime: string;

    employee: {
      _id: any;
      role: string;
    };
  }
}
