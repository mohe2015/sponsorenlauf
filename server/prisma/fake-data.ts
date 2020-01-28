import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

main()

async function asyncForEach(array:any, callback:any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function main() {
  const prisma = new PrismaClient()
  
  if (!(await prisma.users.findOne({where: {
    name: "admin"
  }}))) {
    const hashedPassword = await hash('admin', 10)
    const admin = await prisma.users.create({
      data: {
        name: "admin",
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log('added admin account:\n', admin)
  }

  var content = fs.readFileSync('prisma/test.csv', 'utf8');

  let records = parse(content, {
    columns: true
  })

  records = records.sort((a:any, b:any) => a['Klasse'].localeCompare(b['Klasse']))
  
  await asyncForEach(records, async (data:any) => {
    console.log(data);
    await prisma.students.create({
      data: {
        name: data['Name'],
        class: data['Klasse'],
        grade: Number(data['Jahrgang']),
      }
    })
  })

  await prisma.disconnect()
}
