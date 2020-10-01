import { subscriptionType } from '@nexus/schema'
import { withFilter } from "graphql-subscriptions";
import { Round, RoundWhereUniqueInput, User, UserWhereUniqueInput } from "nexus-plugin-prisma/client";

export const Subscription = subscriptionType({
  definition(t) {
    t.field("subscribeRounds", {
      type: "CreateRoundMutationOutput",
      subscribe: withFilter(
        function (root, args, context, info) {
          return context.pubsub.asyncIterator("ROUNDS");
        },
        (payload /*: Round*/, args: RoundWhereUniqueInput) => {
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
        (payload /*: UserMutationOutput*/, args: UserWhereUniqueInput) => {
          return true;
        }
      ),
      resolve(payload /*: UserMutationOutput*/, args, context, info) {
        return payload;
      },
    });
  },
});
