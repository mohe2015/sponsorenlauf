// https://gist.github.com/outerlook/c88a98335f976bba0a51db9de135f0c5

export const decode = (objectId: string) => {
  const decoded = Buffer.from(objectId, 'base64').toString('utf8')
  const parts = decoded.split(':')
  return {
    id: parts[0],
    __typename: parts[1],
  }
}
export const encode = (id: string, __typename: string) =>
  Buffer.from(`${id}:${__typename}`, 'utf8').toString('base64')

export const fromGlobalId = (globalId: string) => {
  return decode(globalId).id
}

export const toGlobalId = ({
  id,
  __typename,
}: {
  id: string
  __typename: string
}) => encode(id, __typename)
