import { objectType, enumType, unionType, inputObjectType } from 'nexus'
import { Context } from '../context';
import { isUserWithRole } from '../permissions';

export const UserRole = enumType({
  name: "UserRole",
  members: ["ADMIN", "TEACHER", "VIEWER"],
  description: "The users role",
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id", {
      authorize: () => true
    });
    t.nonNull.string("name", {
      authorize: isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
    });
    t.nonNull.string("password", {
      authorize: isUserWithRole(["ADMIN"]),
    });
    t.nonNull.field('role', {
      type: 'UserRole',
      authorize: isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
    })
    t.nonNull.list.nonNull.field('createdRounds', {
      type: 'Round',
      authorize: isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      resolve: (parent, _, context: Context) => {
        return context.db.user.findUnique({
          where: { id: parent.id }
        }).createdRounds()
      }
    })
  },
});

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.nullable.string("password");
    t.nonNull.field('role', {
      type: 'UserRole'
    })
  }
})

export const UserMutationError = objectType({
  name: "UserMutationError",
  definition(t) {
    t.string("usernameError");
    t.nullable.string("roleError");
  },
});

export const UserMutationOutput = objectType({
  name: "UserMutationOutput",
  definition(t) {
    t.field("edge", {type: "UserEdge"})
  }
})

export const UserMutationResponse = unionType({
  name: "UserMutationResponse",
  definition(t) {
    t.members(
      "UserMutationOutput",
      "UserMutationError"
    )
  }
})

export const UserWhereUniqueInput = inputObjectType({
  name: "UserWhereUniqueInput",
  definition(t) {
    t.nullable.id("id");
    t.nullable.string("name");
  }
})

export const UserUpdateInput = inputObjectType({
  name: "UserUpdateInput",
  definition(t) {
    // primary keys
    t.nullable.id("id");
    t.nullable.string("name");

    t.nullable.string("password");
    t.nullable.field('role', {
      type: 'UserRole'
    })
  }
})