import { enumType, objectType } from "@nexus/schema";

export const UserRole = enumType({
  name: "UserRole",
  members: ["ADMIN", "TEACHER", "VIEWER"],
  description: "The users role",
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.password();
    t.model.role();
    t.model.createdRounds({ type: "Round" });
  },
});
