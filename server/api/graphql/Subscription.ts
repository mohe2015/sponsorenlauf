import { schema } from "nexus";
import { withFilter } from "graphql-subscriptions";
import { Round, RoundWhereUniqueInput, User, UserWhereUniqueInput } from "nexus-plugin-prisma/client";

schema.subscriptionType({
  definition(t) {
    t.field("SubscribeRounds", {
      type: "Round",
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

    t.field("subscribeUsers", {
      type: "CreateUserMutationOutput",
      subscribe: withFilter(
        function (root, args, context, info) {
          console.log("asyncIterator")
          return context.pubsub.asyncIterator("USERS");
        },
        (payload /*: CreateUserMutationOutput*/, args: UserWhereUniqueInput) => {
          console.log("withFilter")
          return true;
        }
      ),
      resolve(payload /*: CreateUserMutationOutput*/, args, context, info) {
        console.log("resolve")
        return payload;
      },
    });
  },
});
