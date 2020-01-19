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
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjazVqc2dtMnMwMDAwMWZqemthaXlmeTE5IiwiaWF0IjoxNTc5MzYzODU1fQ.WghL7cxbUgnqdWb4lfwQmbc0q0LYrwBwNrYxpRootgA"
}
```