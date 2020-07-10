import { schema } from "nexus";
import { server } from "nexus";
import { log } from "nexus";
import { use } from "nexus";
import { prisma } from "nexus-plugin-prisma";

//schema.addToContext(req => {
//  return { ... }
//})

use(prisma());
