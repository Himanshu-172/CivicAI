import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType<unknown>;
  params?: ZodType<unknown>;
  query?: ZodType<unknown>;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next): void => {
    try {
      if (schemas.body) {
        schemas.body.parse(request.body);
      }

      if (schemas.params) {
        schemas.params.parse(request.params);
      }

      if (schemas.query) {
        schemas.query.parse(request.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
