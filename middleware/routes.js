var addCurrentUser = async (ctx, next) => {
  try {
    if (ctx.isAuthenticated()) {
      let user = {
        username: ctx.req.user.username,
        email: ctx.req.user.email,
        name: ctx.req.user.name,
        country: ctx.req.user.country,
        languages: ctx.req.user.languages,
        type: ctx.req.user.type
      }
      ctx.state.currentUser = user
    }
    await next()
  } catch (err) {
    console.log('error')
    console.log(err)
    ctx.body = err.message
  }
}

module.exports = {
  addCurrentUser: addCurrentUser
}
