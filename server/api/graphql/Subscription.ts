import { subscriptionType } from 'nexus'
import { withFilter } from "graphql-subscriptions";
import { isUserWithRole } from '../permissions';

export const Subscription = subscriptionType({
  definition(t) {
    
    t.field("subscribeRounds", {
      type: "CreateRoundMutationOutput",
      authorize: isUserWithRole(["ADMIN", "TEACHER", "VIEWER"]),
      subscribe: withFilter(
        function (root, args, context, info) {
          return context.pubsub.asyncIterator("ROUNDS");
        },
        (payload, args) => { // payload: Round
          return true;
        }
      ),
      resolve(payload, args, context, info) { // payload: Round
        return payload;
      },
    });

    t.field("subscribeUsers", {
      type: "UserMutationOutput",
      authorize: isUserWithRole(["ADMIN"]),
      subscribe: withFilter(
        function (root, args, context, info) {
          return context.pubsub.asyncIterator("USERS");
        },
        (payload, args) => { // payload: UserMutationOutput
          return true;
        }
      ),
      resolve(payload, args, context, info) { // payload: UserMutationOutput
        return payload;
      },
    });
  },
});

