import { PrismaClient, PrismaPromise } from "@prisma/client";
import { hash } from 'argon2'
import parse from "csv-parse/lib/sync";
import fs from "fs";
import dotenv from "dotenv";

main();

async function asyncForEach(array: any, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function main() {
  dotenv.config();

  const db = new PrismaClient({
    log: ['info', 'warn'],
  });

  //db.$executeRaw`CREATE INDEX IF NOT EXISTS "Runner_roundCount_id" ON "Runner" ( "roundCount" DESC, "id" ASC );`;

  if (
    !(await db.user.findUnique({
      where: {
        name: "admin",
      },
    }))
  ) {
    // @ts-ignore
    const hashedPassword = await hash("admin", 10);
    const admin = await db.user.create({
      data: {
        name: "admin",
        // @ts-ignore
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("added admin account:\n", admin);
  }

  var content = fs.readFileSync("prisma/test.csv", "utf8");

  let records = parse(content, {
    columns: true,
  });

  records = records.sort((a: any, b: any) =>
    a["Klasse"].localeCompare(b["Klasse"])
  );

  await asyncForEach(records, async (data: any) => {
    let roundCount = Math.floor(Math.random() * (50 - 5 + 1) + 5);

    console.log(data)


    await db.$transaction([db.runner.create({
      data: {
        name: data["Name"],
        clazz: data["Klasse"],
        grade: Number(data["Jahrgang"]),
        roundCount,
      },
    }) as PrismaPromise<any>].concat(Array.from(Array(roundCount).keys()).map(i =>
      db.round.create({
        data: {
          student: {
            connect: {
              name: data["Name"]
            }
          },
          createdBy: {
            connect: {
              name: "admin"
            }
          },
        }
      })
    )))
  })

  await db.$disconnect();
}
