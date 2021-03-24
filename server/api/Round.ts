import { objectType } from 'nexus'
import { Context } from '../src/context';

export const Round = objectType({
  name: "Round",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.field('student', {
      type: 'Runner',
      resolve: (parent, _, context: Context) => {
        return context.db.round.findUnique({
          where: { id: parent.id }
        }).student();
      }
    });
    t.nonNull.field("time", { type: "DateTime" });
    t.nonNull.field('createdBy', {
      type: 'User',
      resolve: (parent, _, context: Context) => {
        return context.db.round.findUnique({
          where: { id: parent.id }
        }).createdBy();
      }
    })
  },
});
