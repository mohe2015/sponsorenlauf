import { use } from "nexus";
import { schema } from "nexus";
import { settings } from "nexus";
import { prisma } from "nexus-plugin-prisma";
import { PubSub } from "graphql-subscriptions";

use(
  prisma({
    features: {
      crud: true,
    },
  })
);

schema.addToContext(() => {
  return {
    pubsub: new PubSub(),
    userId: 1,
  };
});
