const { Streamer, Follower, Stream, Game, Viewer } = require('../models')
const pagination = require('../services/pagination')
const sequelize = require('sequelize')
const { Op } = require('sequelize')

module.exports = {
  index (req, res) {
    const { page, size } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    return Streamer.findAndCountAll({
      limit: limit,
      offset: offset
    })
      .then(streamers => {
        const response = pagination.getPagingData(streamers, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  findById (req, res) {
    const id = req.params.id

    return Streamer.findByPk(id)
      .then(streamer => {
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchFollowers (req, res) {
    const id = req.params.id

    return Follower.findOne({
      attributes: [ 'count' ],
      where: {
        streamId: id
      },
      order: [ [ 'createdAt', 'DESC' ] ],
      include: [ {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt' ] }
      }
      ]
    })
      .then(streamer => {
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchLastStream (req, res) {
    const id = req.params.id

    return Stream.findOne({
      attributes: { exclude: [ 'streamerId', 'gameId', 'StreamerId', 'GameId' ] },
      where: {
        streamerId: id
      },
      order: [ [ 'startedAt', 'DESC' ] ],
      limit: 1
    })
      .then(streamer => {
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchAverageViewers (req, res) {
    const id = req.params.id

    return Viewer.findOne({
      attributes: [
        [ sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('count')), 0), 'average' ]
      ],
      include: {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt' ]
        },
        where: {
          streamerId: id
        }
      }
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchAverageViewersByPeriod (req, res) {
    const id = req.params.id
    const period = req.params.period

    let dateFormat = ''
    if (period === 'minute') {
      dateFormat = '%Y-%m-%d %H:%m'
    } else if (period === 'hour') {
      dateFormat = '%Y-%m-%d %H'
    } else if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    }

    return Viewer.findAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('createdAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('count')), 0), 'average' ]
      ],
      group: [ [sequelize.fn('date_format', sequelize.col('createdAt'), dateFormat), 'date'] ],
      include: {
        model: Stream,
        attributes: {
          include: []
        },
        where: {
          streamerId: id
        }
      }
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchAverageFollowersByPeriod (req, res) {
    const id = req.params.id
    const period = req.params.period

    let dateFormat = ''
    if (period === 'minute') {
      dateFormat = '%Y-%m-%d %H:%m'
    } else if (period === 'hour') {
      dateFormat = '%Y-%m-%d %H'
    } else if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    }

    return Follower.findAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('count')), 0), 'average' ]
      ],
      group: [ [sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'date'] ],
      include: {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt' ]
        },
        include: {
          model: Streamer,
          where: {
            id: id
          }
        }
      }
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchGamesStreamed (req, res) {
    const id = req.params.id

    return Stream.findAll({
      attributes: [
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('duration')), 0), 'total' ]
      ],
      group: [ 'gameId' ],
      where: {
        streamerId: id,
        finishedAt: {
          [Op.not]: null
        }
      },
      include: [ { model: Game, attributes: { exclude: [ 'createdAt', 'updatedAt' ] } } ]
    })
      .then(streamer => {
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchHoursStreamedByPeriod (req, res) {
    const id = req.params.id
    const period = req.params.period

    let dateFormat = ''
    if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    }

    return Stream.findAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('duration')), 0), 'total' ]
      ],
      where: {
        streamerId: id
      },
      group: [ [sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date'] ]
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchFollowersByPeriod (req, res) {
    const id = req.params.id
    const period = req.params.period

    let dateFormat = ''
    if (period === 'minute') {
      dateFormat = '%Y-%m-%d %H:%m'
    } else if (period === 'hour') {
      dateFormat = '%Y-%m-%d %H'
    } else if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    }

    return Follower.findAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('count')), 0), 'total' ]
      ],
      group: [ [sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'date'] ],
      include: {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt' ]
        },
        where: {
          streamerId: id
        }
      }
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchStreams (req, res) {
    const id = req.params.id

    return Stream.findAll({
      attributes: [
        'id',
        [ sequelize.fn('MAX', sequelize.col('Followers.count')), 'maxFollowers' ],
        [ sequelize.fn('MAX', sequelize.col('Viewers.count')), 'maxViewers' ],
        'duration',
        'startedAt',
        'finishedAt'
      ],
      where: {
        streamerId: id
      },
      group: [ 'Stream.id' ],
      order: [ [ 'startedAt', 'DESC' ] ],
      include: [
        { model: Game, attributes: { exclude: [ 'createdAt', 'updatedAt' ] } },
        { model: Viewer, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } },
        { model: Follower, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } }
      ]
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchRecentStreams (req, res) {
    const id = req.params.id
    const limit = parseInt(req.params.limit)

    return Stream.findAll({
      attributes: [
        'id',
        [ sequelize.literal(`(SELECT MAX(count) FROM viewers WHERE streamId = id)`), 'maxViewers' ],
        [ sequelize.literal(`(SELECT MAX(count) FROM followers WHERE streamId = id)`), 'maxFollowers' ],
        'duration',
        'startedAt',
        'finishedAt'
      ],
      where: {
        streamerId: id
      },
      limit: limit,
      group: [ 'Stream.id' ],
      order: [ [ 'startedAt', 'DESC' ] ],
      include: [
        { model: Viewer, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } },
        { model: Follower, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } }
      ]
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchStreamsByDateRange (req, res) {
    const id = req.params.id
    const startedAt = req.params.startDate
    const finishedAt = req.params.endDate

    const dateFormat = '%Y-%m-%d'

    return Stream.findAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('*')), 0), 'count' ]
      ],
      where: {
        streamerId: id,
        [Op.or]: [{
          startedAt: {
            [Op.between]: [startedAt, finishedAt]
          }
        }, {
          finishedAt: {
            [Op.between]: [startedAt, finishedAt]
          }
        }]
      },
      group: [[sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date']],
      order: [ 'startedAt' ]
    })
      .then(streams => {
        res.status(200).json(streams)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchCumulativeViewerCount (req, res) {
    const id = req.params.id
    const period = req.params.period

    let dateFormat = ''
    if (period === 'minute') {
      dateFormat = '%Y-%m-%d %H:%m'
    } else if (period === 'hour') {
      dateFormat = '%Y-%m-%d %H'
    } else if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    }

    return Stream.findAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('Stream.duration')), 0), 'duration' ],
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('count')), 0), 'viewers' ]
      ],
      where: {
        streamerId: id
      },
      include: [
        {
          model: Viewer,
          attributes: {
            exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ]
          }
        }
      ],
      group: [[sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date']],
      order: [ 'startedAt' ]
    })
      .then(streams => {
        res.status(200).json(streams)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchCumulativeFollowerCount (req, res) {
    const id = req.params.id
    const period = req.params.period

    let dateFormat = ''
    if (period === 'minute') {
      dateFormat = '%Y-%m-%d %H:%m'
    } else if (period === 'hour') {
      dateFormat = '%Y-%m-%d %H'
    } else if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    }

    return Stream.findAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('count')), 0), 'followers' ],
        [ sequelize.fn('COUNT', sequelize.col('Stream.id')), 'streams' ]
      ],
      where: {
        streamerId: id
      },
      include: [
        {
          model: Follower,
          attributes: {
            exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ]
          }
        }
      ],
      group: [[sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date']],
      order: [ 'startedAt' ]
    })
      .then(streams => {
        res.status(200).json(streams)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchTopStreamers (req, res) {
    return Stream.findAll({
      attributes: [
        'id',
        [ sequelize.fn('MAX', sequelize.col('Followers.count')), 'maxFollowers' ],
        [ sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('Viewers.count')), 0), 'averageViewers' ],
        [ sequelize.fn('MAX', sequelize.col('Viewers.count')), 'peakViewers' ],
        'duration',
        'startedAt',
        'finishedAt'
      ],
      include: [
        { model: Viewer, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } },
        { model: Follower, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } }
      ]
    })
      .then(averageViewers => {
        res.status(200).json(averageViewers)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  create (req, res) {
    const data = req.body

    return Streamer.create(data)
      .then(streamer => {
        res.status(200).json({
          status: 200,
          message: 'Streamer created',
          data: { streamer: streamer.id }
        })
      })
      .catch(error => {
        console.error('Error on creating streamer', error)
        res.status(500).json({ message: 'Error on creating streamer' })
      })
  },

  update (req, res) {
    const data = req.body
    const id = req.params.id

    return Streamer.update(data, { where: { id: id }, individualHooks: true })
      .then(result => {
        res.status(200).json({ status: 200, message: 'Streamer updated' })
      })
      .catch(error => {
        console.error('Error on updating streamer', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on updating streamer' })
      })
  },

  delete (req, res) {
    const id = req.params.id

    return Streamer.destroy({ where: { id: id } })
      .then(affectedRows => {
        if (affectedRows === 0) {
          return res
            .status(404)
            .json({ status: 404, message: 'Streamer not found' })
        } else if (affectedRows === 1) {
          return res.status(200).json({ status: 200, message: 'Streamer deleted' })
        } else {
          return Promise.reject(
            new Error('Unexpected error. Wrong amount deletion of streamer')
          )
        }
      })
      .catch(error => {
        console.error('Error on deleting streamer', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on deleting streamer' })
      })
  }
}
