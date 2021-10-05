module.exports = {
  getPagination (page, size) {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset }
  },

  getPagingData (data, page, limit) {
    const { count: totalItems, rows: streamers } = data
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, streamers, totalPages, currentPage }
  }
}
