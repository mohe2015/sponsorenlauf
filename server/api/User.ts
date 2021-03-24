import { objectType, enumType } from 'nexus'
import { Context } from '../context';

export const UserRole = enumType({
  name: "UserRole",
  members: ["ADMIN", "TEACHER", "VIEWER"],
  description: "The users role",
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("password");
    t.nonNull.field('role', {
      type: 'UserRole'
    })
    t.nonNull.list.nonNull.field('createdRounds', {
      type: 'Round',
      resolve: (parent, _, context: Context) => {
        return context.db.user.findUnique({
          where: { id: parent.id }
        }).createdRounds()
      }
    })
  },
});
