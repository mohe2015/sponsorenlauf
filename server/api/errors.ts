import { NextFunction, Request, Response } from "express";
import hijackResponse from "hijackresponse";
import { ApolloError } from "apollo-server-errors";

// https://github.com/graphql-nexus/nexus/issues/761#issuecomment-627989689

export class LoginExpired extends ApolloError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, "LOGIN_EXPIRED", properties);

    Object.defineProperty(this, "name", { value: this.constructor.name });
  }
}
export class AuthenticationError extends ApolloError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, "UNAUTHENTICATED", properties);

    Object.defineProperty(this, "name", { value: this.constructor.name });
  }
}
export class ForbiddenError extends ApolloError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, "FORBIDDEN", properties);

    Object.defineProperty(this, "name", { value: this.constructor.name });
  }
}
export class UserInputError extends ApolloError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, "BAD_USER_INPUT", properties);

    Object.defineProperty(this, "name", { value: this.constructor.name });
  }
}

export class SyntaxError extends ApolloError {
  constructor(message: string) {
    super(message, "GRAPHQL_PARSE_FAILED");

    Object.defineProperty(this, "name", { value: this.constructor.name });
  }
}

export class ValidationError extends ApolloError {
  constructor(message: string) {
    super(message, "GRAPHQL_VALIDATION_FAILED");

    Object.defineProperty(this, "name", { value: this.constructor.name });
  }
}

/**
 * Stupid problems sometimes require stupid solutions.
 * Unfortunately `express-graphql` has hardcoded 4xx/5xx http status codes in certain error scenarios.
 * In addition they also finalize the response, so no other middleware shall prevail in their wake.
 *
 * It's best practice to always return 200 in GraphQL APIs and specify the error in the response,
 * as otherwise clients might choke on the response or unnecessarily retry stuff.
 * Also monitoring is improved by only throwing 5xx responses on unexpected server errors.
 *
 * This middleware will hijack the `res.send` method which gives us one last chance to modify
 * the response and normalize the response status codes.
 *
 * The only alternative to this would be to either fork or ditch `express-graphql`. ;-)
 */

// Extend Express Response with hijack specific function
interface IHijackedResponse extends Response {
  unhijack: () => void;
}

export const formatErrors = (
  _: Request,
  originalRes: Response,
  next: NextFunction
) => {
  hijackResponse(originalRes, (err: Error, res: IHijackedResponse) => {
    // In case we encounter a "real" non GraphQL server error
    // we keep it untouched and move on.
    if (err) {
      res.unhijack();
      return next(err);
    }
    // We like our status code simple in GraphQL land
    // e.g. Apollo clients will retry on 5xx despite potentially not necessary.
    res.statusCode = 200;
    res.pipe(res);
  });
  // next() must be called explicitly, even when hijacking the response:
  next();
};
