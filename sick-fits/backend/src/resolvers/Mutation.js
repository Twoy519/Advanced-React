const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check for login

    // passes db object in through context
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },

      // also pass `info` because the query is inside here
      // needs to pass the query to the backend
      info
    )

    return item
  }
}

module.exports = Mutations
