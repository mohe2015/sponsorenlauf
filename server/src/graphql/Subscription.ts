import { schema } from "nexus";

schema.subscriptionField("SubscribeRounds", {
  type: "Round",
  subscribe: (source, args, context, info) => {
    return context.pubSub.asyncIterator("ROUNDS");
  },
  resolve: (source, args, context, info) => {
    return source;
  },
});
