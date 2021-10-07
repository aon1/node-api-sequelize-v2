module.exports = {
  getPagination (page, size) {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0

    return { limit, offset }
  },

  getPagingData (input, page, limit) {
    const { count: totalItems, rows: data } = input
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, data, totalPages, currentPage }
  },

  getPagingDataAggregated (input, page, limit) {
    const totalItems = input.count.length
    const data = input.rows
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, data, totalPages, currentPage }
  }
}
