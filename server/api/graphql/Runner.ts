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
    t.model.roundCount();
  },
});
