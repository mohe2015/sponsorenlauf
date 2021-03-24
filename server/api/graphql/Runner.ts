import { objectType } from 'nexus'
import { Context } from '../context';
import { Node } from "./Node";

export const Runner = objectType({
  name: "Runner",
  definition(t) {
    t.implements(Node);
    t.nonNull.id("id");
    t.nonNull.int("startNumber");
    t.nonNull.string("name");
    t.nonNull.string("clazz");
    t.nonNull.int("grade");
    t.nonNull.list.nonNull.field('rounds', {
      type: 'Round',
      resolve: (parent, _, context: Context) => {
        return context.db.runner.findUnique({
          where: { id: parent.id }
        }).rounds()
      }
    })
    t.nonNull.int("roundCount");
  },
});
