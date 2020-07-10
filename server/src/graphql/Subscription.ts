import { schema } from "nexus";

schema.subscriptionType({
  definition(t) {
    t.field("test", {
      type: "SubscribeRounds",
      subscribe(root, args, context, info) {
        return context.pubSub.asyncIterator("ROUNDS");
      },
      resolve(root, args, context, info) {
        return root;
      },
    });
  },
});
