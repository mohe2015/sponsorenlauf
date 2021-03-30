import { UserRole } from "@prisma/client";
import { Context } from "./context";
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";

export const isUserWithRole = (roles: UserRole[]) =>
    (async (_root: any, _args: any, ctx: Context, _info: any) => {
      const user = ctx.user;
      if (!roles.some((r) => user && r === user.role)) {
        if (ctx.user) {
          throw new ForbiddenError("Not enough permissions!")
        } else {
          throw new AuthenticationError("Not authenticated!")
        }
      }
    });