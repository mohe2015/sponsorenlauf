import { schema } from "nexus";
import { withFilter } from "graphql-subscriptions";
import { Round, RoundWhereUniqueInput } from "nexus-plugin-prisma/client";

schema.subscriptionType({
  definition(t) {
    t.field("test", {
      type: "Subscription",
      subscribe: withFilter(
        function (root, args, context, info) {
          return context.pubsub.asyncIterator("ROUNDS");
        },
        (payload: Round, args: RoundWhereUniqueInput) => {
          return true;
        }
      ),
      resolve(payload: Round, args, context, info) {
        return payload;
      },
    });
  },
});
