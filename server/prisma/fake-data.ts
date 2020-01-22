import { Photon } from '@prisma/photon'
import { hash } from 'bcrypt'
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

main()

async function asyncForEach(array:any, callback:any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function main() {
  const photon = new Photon()
  
  const hashedPassword = await hash('admin', 10)
  const admin = await photon.users.create({
    data: {
      name: "admin",
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('added admin account:\n', admin)

  var content = fs.readFileSync('prisma/test-data.csv', 'utf8');

  const records = parse(content, {
    columns: true
  })
  
  await asyncForEach(records, async (data:any) => {
    console.log(data);
    await photon.students.create({
      data: {
        name: data['Name'],
        class: data['Klasse'],
        grade: Number(data['Jahrgang']),
      }
    })
  })

  await photon.disconnect()
}
