import { use } from "nexus";
import { settings } from "nexus";
import { prisma } from "nexus-plugin-prisma";

use(
  prisma({
    features: {
      crud: true,
    },
  })
);
