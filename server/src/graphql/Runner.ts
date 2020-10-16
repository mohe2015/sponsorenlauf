import { objectType } from '@nexus/schema'
import { Node } from "./Node";

export const Runner = objectType({
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
    t.model.roundCount();
  },
});
