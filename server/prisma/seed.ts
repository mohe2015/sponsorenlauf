import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
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

  const db = new PrismaClient();

  if (
    !(await db.user.findOne({
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

  var content = fs.readFileSync("test.csv", "utf8");

  let records = parse(content, {
    columns: true,
  });

  records = records.sort((a: any, b: any) =>
    a["Klasse"].localeCompare(b["Klasse"])
  );

  let i = 0;
  await asyncForEach(records, async (data: any, index: number) => {
    console.log(data);
    await db.student.create({
      data: {
        startNumber: i++,
        name: data["Name"],
        class: data["Klasse"],
        grade: Number(data["Jahrgang"]),
      },
    });
  });

  await db.disconnect();
}
