declare global {
  namespace Express {
    interface Request {
      authToken?: string;
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};

