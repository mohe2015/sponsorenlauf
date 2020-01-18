# Blog

### Try It

```
yarn && yarn dev
```

https://github.com/prisma/prisma-examples/tree/prisma2/typescript/graphql-auth

https://github.com/prisma-labs/nexus-prisma

```graphql
mutation Signup {
  signup(name: "moritz", password: "moritz") {
    token
  }
}

{
  "Authentication": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTU3OTM2MDkxMX0.3q_HvoSPBpfz3K7FZdJXE8SaduUFZfKmttYAbvPd9Cs"
}
```