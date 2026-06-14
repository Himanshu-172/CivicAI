import type { RequestHandler } from "express";

export const jwtStub: RequestHandler = (request, _response, next) => {
  const authorization = request.header("authorization");

  request.authToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;

  next();
};

