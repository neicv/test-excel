export default (context, inject) => {
  inject('api', async (controller, method, params) => {
    try {
      return await context.$axios['$' + (params ? 'post' : 'get')](
        '/api/' + controller + '/' + method,
        params
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      throw e
    }
  })
}
