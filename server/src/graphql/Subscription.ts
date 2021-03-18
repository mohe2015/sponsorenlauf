import { subscriptionType } from 'nexus'
import { withFilter } from "graphql-subscriptions";

export const Subscription = subscriptionType({
  definition(t) {
    t.field("subscribeRounds", {
      type: "CreateRoundMutationOutput",
      subscribe: withFilter(
        function (root, args, context, info) {
          return context.pubsub.asyncIterator("ROUNDS");
        },
        (payload /*: Round*/, args) => {
          return true;
        }
      ),
      resolve(payload/*: Round*/, args, context, info) {
        return payload;
      },
    });

    t.field("subscribeUsers", {
      type: "UserMutationOutput",
      subscribe: withFilter(
        function (root, args, context, info) {
          return context.pubsub.asyncIterator("USERS");
        },
        (payload /*: UserMutationOutput*/, args) => {
          return true;
        }
      ),
      resolve(payload /*: UserMutationOutput*/, args, context, info) {
        return payload;
      },
    });
  },
});
