const { Streamer, Follower, Stream, Game, Viewer } = require('../models')
const pagination = require('../services/pagination')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const { logger } = require('../services/logger')

module.exports = {
  index (req, res) {
    const { site, page, size } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    let where = {}
    if (site === 'twitch') {
      where = {
        twitchId: {
          [Op.not]: null
        }
      }
    } else if (site === 'youtube') {
      where = {
        youtubeId: {
          [Op.not]: null
        }
      }
    } else {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    return Streamer.findAndCountAll({
      where: where,
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
        if (!streamer) {
          return res.status(404).end()
        }

        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchFollowers (req, res) {
    const id = req.params.id
    const { site } = req.query

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    return Follower.findOne({
      attributes: [
        [ sequelize.fn('COALESCE', sequelize.fn('MAX', sequelize.col('count')), 0), 'total' ]
      ],
      order: [ [ 'createdAt', 'DESC' ] ],
      include: [ {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt', 'externalId', 'site' ]
        },
        where: {
          streamerId: id,
          site: site
        }
      }
      ]
    })
      .then(streamer => {
        if (!streamer) {
          return res.status(404).end()
        }
        res.status(200).json(streamer)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchLastStream (req, res) {
    const id = req.params.id
    const { site } = req.query

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    return Stream.findOne({
      attributes: { exclude: [ 'streamerId', 'gameId', 'StreamerId', 'GameId' ] },
      where: {
        streamerId: id,
        site: site
      },
      order: [ [ 'startedAt', 'DESC' ] ],
      limit: 1
    })
      .then(streamer => {
        if (!streamer) {
          return res.status(404).end()
        }
        return res.status(200).json(streamer)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchAverageViewers (req, res) {
    const id = req.params.id
    const { site } = req.query

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    return Viewer.findOne({
      attributes: [
        [ sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('count')), 0), 'average' ]
      ],
      include: {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt', 'externalId', 'site' ]
        },
        where: {
          streamerId: id,
          site: site
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
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    let dateFormat = ''
    if (period === 'minute') {
      dateFormat = '%Y-%m-%d %H:%m'
    } else if (period === 'hour') {
      dateFormat = '%Y-%m-%d %H'
    } else if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    } else {
      return res.status(400).json({ message: 'invalid period' })
    }

    return Viewer.findAndCountAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('createdAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('count')), 0), 'count' ]
      ],
      group: [ [sequelize.fn('date_format', sequelize.col('createdAt'), dateFormat), 'createdAt'] ],
      include: {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt', 'externalId', 'site' ]
        },
        where: {
          streamerId: id,
          site: site
        }
      },
      limit: limit,
      offset: offset
    })
      .then(averageViewers => {
        const response = pagination.getPagingDataAggregated(averageViewers, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchAverageFollowersByPeriod (req, res) {
    const id = req.params.id
    const period = req.params.period
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    let dateFormat = ''
    if (period === 'minute') {
      dateFormat = '%Y-%m-%d %H:%m'
    } else if (period === 'hour') {
      dateFormat = '%Y-%m-%d %H'
    } else if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    } else {
      return res.status(400).json({ message: 'invalid period' })
    }

    return Follower.findAndCountAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('count')), 0), 'count' ]
      ],
      group: [ [sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'createdAt'] ],
      include: {
        model: Stream,
        attributes: {
          exclude: [ 'id', 'streamerId', 'gameId', 'duration', 'GameId', 'StreamerId', 'createdAt', 'updatedAt', 'startedAt', 'finishedAt', 'externalId', 'site' ]
        },
        where: {
          streamerId: id,
          site: site
        }
      },
      limit: limit,
      offset: offset
    })
      .then(averageFollowers => {
        const response = pagination.getPagingDataAggregated(averageFollowers, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchGamesStreamed (req, res) {
    const id = req.params.id
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    return Stream.findAndCountAll({
      attributes: [
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('duration')), 0), 'duration' ]
      ],
      group: [ 'gameId' ],
      where: {
        streamerId: id,
        site: site,
        finishedAt: {
          [Op.not]: null
        }
      },
      include: [ { model: Game, attributes: { exclude: [ 'createdAt', 'updatedAt' ] } } ],
      limit: limit,
      offset: offset
    })
      .then(streamer => {
        const response = pagination.getPagingDataAggregated(streamer, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchHoursStreamedByPeriod (req, res) {
    const id = req.params.id
    const period = req.params.period
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    let dateFormat = ''
    if (period === 'day') {
      dateFormat = '%Y-%m-%d'
    } else if (period === 'month') {
      dateFormat = '%Y-%m'
    } else {
      return res.status(400).json({ message: 'invalid period' })
    }

    return Stream.findAndCountAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('duration')), 0), 'duration' ]
      ],
      where: {
        streamerId: id,
        site: site
      },
      group: [ [sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'startedAt'] ],
      limit: limit,
      offset: offset
    })
      .then(hoursStreamed => {
        const response = pagination.getPagingDataAggregated(hoursStreamed, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchFollowersByPeriod (req, res) {
    const id = req.params.id
    const period = req.params.period
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

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

    return Follower.findAndCountAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('MAX', sequelize.col('count')), 0), 'total' ]
      ],
      group: [ [sequelize.fn('date_format', sequelize.col('Follower.createdAt'), dateFormat), 'createdAt'] ],
      include: {
        model: Stream,
        attributes: {
          exclude: [
            'id',
            'streamerId',
            'gameId',
            'duration',
            'GameId',
            'StreamerId',
            'createdAt',
            'updatedAt',
            'startedAt',
            'finishedAt',
            'twitchId',
            'twitchHandle',
            'youtubeId',
            'youtubeHandle',
            'externalId',
            'site'
          ]
        },
        where: {
          streamerId: id,
          site: site
        }
      },
      limit: limit,
      offset: offset
    })
      .then(followersByPeriod => {
        const response = pagination.getPagingDataAggregated(followersByPeriod, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchStreams (req, res) {
    const id = req.params.id
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    const attributes = [
      'id',
      'externalId',
      [ sequelize.fn('MAX', sequelize.col('Followers.count')), 'maxFollowers' ],
      [ sequelize.fn('MAX', sequelize.col('Viewers.count')), 'maxViewers' ],
      'duration',
      'startedAt',
      'finishedAt'
    ]

    return Stream.findAndCountAll({
      subQuery: false,
      attributes: attributes,
      where: {
        streamerId: id,
        site: site
      },
      group: [ 'Stream.id' ],
      order: [ [ 'startedAt', 'DESC' ] ],
      include: [
        { model: Streamer, attributes: { exclude: [ 'id', 'twitchId', 'twitchHandle', 'youtubeId', 'youtubeHandle', 'name', 'thumbnail', 'createdAt', 'updatedAt', 'deletedAt', 'site' ] } },
        { model: Game, attributes: { exclude: [ 'createdAt', 'updatedAt' ] } },
        { model: Viewer, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } },
        { model: Follower, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } }
      ],
      limit: limit,
      offset: offset
    })
      .then(streams => {
        const response = pagination.getPagingDataAggregated(streams, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchRecentStreams (req, res) {
    const id = req.params.id
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    return Stream.findAndCountAll({
      attributes: [
        'id',
        [ sequelize.literal(`(SELECT MAX(count) FROM Viewers WHERE streamId = id)`), 'maxViewers' ],
        [ sequelize.literal(`(SELECT MAX(count) FROM Followers WHERE streamId = id)`), 'maxFollowers' ],
        'duration',
        'startedAt',
        'finishedAt'
      ],
      where: {
        streamerId: id,
        site: site
      },
      limit: limit,
      offset: offset,
      group: [ 'Stream.id' ],
      order: [ [ 'startedAt', 'DESC' ] ],
      include: [
        { model: Viewer, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } },
        { model: Follower, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } }
      ]
    })
      .then(averageViewers => {
        const response = pagination.getPagingDataAggregated(averageViewers, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchStreamsByDateRange (req, res) {
    const id = req.params.id
    const startedAt = req.params.startDate
    const finishedAt = req.params.endDate
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    const dateFormat = '%Y-%m-%d'

    return Stream.findAndCountAll({
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('*')), 0), 'count' ]
      ],
      where: {
        streamerId: id,
        site: site,
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
      group: [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat) ],
      distinct: true,
      order: [ 'startedAt' ],
      limit: limit,
      offset: offset
    })
      .then(streams => {
        const response = pagination.getPagingDataAggregated(streams, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchCumulativeViewerCount (req, res) {
    const id = req.params.id
    const period = req.params.period
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

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

    return Stream.findAndCountAll({
      subQuery: false,
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('Stream.duration')), 0), 'duration' ],
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('count')), 0), 'count' ]
      ],
      where: {
        streamerId: id,
        site: site
      },
      include: [
        {
          model: Viewer,
          attributes: {
            exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ]
          }
        }
      ],
      group: [[sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'startedAt']],
      order: [ 'startedAt' ],
      limit: limit,
      offset: offset
    })
      .then(cumulativeViewers => {
        const response = pagination.getPagingDataAggregated(cumulativeViewers, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchCumulativeFollowerCount (req, res) {
    const id = req.params.id
    const period = req.params.period
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

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

    return Stream.findAndCountAll({
      subQuery: false,
      attributes: [
        [ sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'date' ],
        [ sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('count')), 0), 'followers' ],
        [ sequelize.fn('COUNT', sequelize.col('Stream.id')), 'streams' ]
      ],
      where: {
        streamerId: id,
        site: site
      },
      include: [
        {
          model: Follower,
          attributes: {
            exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ]
          }
        }
      ],
      group: [[sequelize.fn('date_format', sequelize.col('startedAt'), dateFormat), 'startedAt']],
      order: [ 'startedAt' ],
      limit: limit,
      offset: offset
    })
      .then(cumulativeFollowers => {
        const response = pagination.getPagingDataAggregated(cumulativeFollowers, page, limit)
        res.status(200).json(response)
      })
      .catch(error => {
        res.status(500).json({ status: 500, message: error })
      })
  },

  fetchTopStreamers (req, res) {
    const { page, size, site } = req.query
    const { limit, offset } = pagination.getPagination(page, size)

    if (!site) {
      res.status(400).json({ message: 'site param required [twitch, youtube]' })
    }

    return Stream.findAndCountAll({
      subQuery: false,
      where: {
        site: site
      },
      attributes: {
        include: [
          'streamerId',
          [ sequelize.fn('MAX', sequelize.col('Followers.count')), 'followers' ],
          [ sequelize.fn('AVG', sequelize.col('Viewers.count')), 'averageViewers' ],
          [ sequelize.fn('MAX', sequelize.col('Viewers.count')), 'peakViewers' ]
        ],
        exclude: [ 'id', 'Streamer.deletedAt', 'gameId', 'GameId', 'StreamerId', 'Streamer', 'startedAt', 'finishedAt', 'duration', 'site', 'externalId' ]
      },
      include: [
        { model: Viewer, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } },
        { model: Follower, attributes: { exclude: [ 'id', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt' ] } },
        { model: Streamer,
          attributes: {
            exclude: [ 'id', 'externalId', 'name', 'thumbnail', 'site', 'streamId', 'count', 'StreamId', 'createdAt', 'updatedAt', 'deletedAt' ]
          }
        }
      ],
      distinct: true,
      group: [ 'streamerId' ],
      limit: limit,
      offset: offset
    })
      .then(streamers => {
        const response = pagination.getPagingDataAggregated(streamers, page, limit)
        res.status(200).json(response)
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
        logger.error('Error on creating streamer', error)
        res.status(400).json({ message: 'Error on creating streamer', error: error.errors })
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
        logger.error('Error on updating streamer', error)
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
        logger.error('Error on deleting streamer', error)
        res
          .status(500)
          .json({ status: 500, message: 'Error on deleting streamer' })
      })
  }
}
