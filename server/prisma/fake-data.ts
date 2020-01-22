import { Photon } from '@prisma/photon'
import { hash } from 'bcrypt'
const csv = require('csv-parser');
const fs = require('fs');

main()

async function main() {
  const photon = new Photon()
  
  /*
  const hashedPassword = await hash('admin', 10)
  const admin = await photon.users.create({
    data: {
      name: "admin",
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('added admin account:\n', admin)
  */

 fs
 .createReadStream('prisma/test-data.csv')
 .pipe(csv())
 .on('data', (data:any) => { 
   console.log(data)  
   photon.students.create({
    // @ts-ignore
     data: {
       name: data['Name'],
       class: data['Klasse'],
       grade: data['Jahrgang'],
     }
   })
  })
 .on('end', () => {
   console.log("end");
 });

  await photon.disconnect()
}
