import { schema } from "nexus";
import { Node } from "./Node";

schema.objectType({
  name: "Runner",
  definition(t) {
    t.implements(Node);
    t.model.id();
    t.model.startNumber();
    t.model.name();
    t.model.clazz();
    t.model.grade();
    t.model.rounds({
      ordering: true,
      type: "Round",
    });
    t.int("roundCount", {
      nullable: false,
      resolve: async (root, args, ctx, info) => {
        return ctx.db.round.count({
          where: {
            student: root
          }
        })
      }
    })
  },
});
