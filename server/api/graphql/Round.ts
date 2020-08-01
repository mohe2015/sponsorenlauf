import { schema } from "nexus";

schema.objectType({
  name: "Round",
  nonNullDefaults: {
    input: true,
    output: true,
  },
  definition(t) {
    t.model.id();
    t.model.student();
    t.model.time();
    t.model.createdBy();
  },
});
