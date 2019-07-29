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
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args }
    // remove the id from the udpates
    // because we don't want to update the id
    delete updates.id
    // run the update method
    // this is calling backend/src/generated/prisma.graphql::updateItem()
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      // need to include this becuase that is how
      // the updateItem function knows what to return
      // this part I don't get but Wes says:
      // "the updateItem is expecting us to return an item
      // so info will contain the query that we send it from
      // the client side to return that item
      info
    )
  }
}

module.exports = Mutations
