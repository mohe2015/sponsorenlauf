import { objectType, enumType } from '@nexus/schema'

enumType({
  name: "UserRole",
  members: ["ADMIN", "TEACHER", "VIEWER"],
  description: "The users role",
});

objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.password();
    t.model.role();
    t.model.createdRounds({ type: "Round" });
  },
});
