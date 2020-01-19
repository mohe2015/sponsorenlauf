import { queryType, intArg, stringArg, idArg } from 'nexus'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      authorize: () => { return true },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.photon.users.findOne({
          where: {
            id: userId,
          },
        })
      },
    })

    t.field('postById', {
      type: 'Post',
      nullable: true,
      args: { id: stringArg() },
      authorize: () => { return true },
      resolve(root, args, ctx) {
        return ctx.photon.posts.findOne({
          where: {
            id: args.id
          }
        });
      },
    })

    t.crud.blogs({
      pagination: false,
    })
    t.crud.users({ filtering: true, alias: 'people' })
    t.crud.posts({ type: 'Post', ordering: true, filtering: true })

    //
    // Examples showing custom resolvers
    //

    t.field('blog', {
      type: 'Blog',
      args: {
        id: stringArg({ required: true }),
      },
      resolve(_root, args, ctx) {
        return ctx.photon.blogs
          .findOne({
            where: {
              id: args.id,
            },
          })
          .then(result => {
            if (result === null) {
              throw new Error(`No blog with id of "${args.id}"`)
            }
            return result
          })
      },
    })

    t.field('blogsLike', {
      type: 'Blog',
      list: true,
      args: {
        name: stringArg(),
        viewCount: intArg(),
      },
      resolve(_root, args, ctx) {
        return ctx.photon.blogs.findMany({
          where: {
            name: args.name,
            viewCount: args.viewCount,
          },
        })
      },
    })
  },
})
