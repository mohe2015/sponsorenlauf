import { Photon } from '@prisma/photon'
import { hash } from 'bcrypt'

main()

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
  await photon.disconnect()
}
