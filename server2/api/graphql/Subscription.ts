import { schema } from "nexus";

schema.subscriptionType({
  definition(t) {
    t.field("test", {
      type: "Subscription",
      subscribe(root, args, context, info) {
        return context.pubSub.asyncIterator("ROUNDS");
      },
      resolve(root, args, context, info) {
        return root;
      },
    });
  },
});
