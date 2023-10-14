declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: AssignmentType;
      name: string;
    };
  }
}
