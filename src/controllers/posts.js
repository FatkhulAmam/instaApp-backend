const joi = require('joi')
const { user, posts, comment } = require('../models')
const paging = require('../helpers/pagination')
const responseStandart = require('../helpers/response')
const { Op } = require('sequelize')

module.exports = {
  addPost: async (req, res) => {
    const { id } = req.user
    const pictures = (req.file ? `uploads/${req.file.filename}` : undefined)
    const schema = joi.object({
      caption: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
    const { caption } = results
    if (!error) {
      const dataUser = {
        picture: pictures,
        description: caption,
        user_Id: id
      }
      await posts.create(dataUser)
      return responseStandart(res, 'post a pict success', {})
    }
    return responseStandart(res, 'error', {}, 401, false)
  },
  getPost: async (req, res) => {
    const { search, sort } = req.query
    let sortBy = ''
    let sortFrom = ''
    if (typeof sort === 'object') {
      sortBy = Object.keys(sort)[0]
      sortFrom = Object.values(sort)[0]
    } else {
      sortBy = 'id'
      sortFrom = sort || 'asc'
    }
    let searchKey = ''
    let searchValue = ''
    if (typeof search === 'object') {
      searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      searchKey = 'user_Id'
      searchValue = search || ''
    }
    const count = await posts.count()
    const page = paging(req, count)
    const { offset, pageInfo } = page
    const { limitData: limit } = pageInfo
    const result = await posts.findAll(
      {
        include: [
          { model: user, as: 'userActive' }
        ],
        limit,
        offset,
        where: {
          [searchKey]: {
            [Op.substring]: `${searchValue}`
          }
        },
        order: [
          [`${sortBy}`, `${sortFrom}`]
        ]
      }
    )
    return responseStandart(res, 'List all post', { result, pageInfo })
  },
  getPostsById: async (req, res) => {
    const { id } = req.params
    const results = await posts.findByPk(id)
    if (results) {
      return responseStandart(res, `post id ${id}`, { results })
    }
    return responseStandart(res, `post ${id} not found`, {}, 401, false)
  },
  addComment: async (req, res) => {
    const { id } = req.user
    const { postId } = req.params
    console.log(req.params)
    const schema = joi.object({
      userComment: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
    const { userComment } = results
    if (!error) {
      const dataUser = {
        user_Id: id,
        post_Id: postId,
        description: userComment
      }
      await comment.create(dataUser)
      return responseStandart(res, 'post a comment success', {})
    }
    return responseStandart(res, 'error', {}, 401, false)
  },
  getCommentById: async (req, res) => {
    const { id } = req.params
    const results = await comment.findAll({
      where: {
        post_Id: id
      }
    })
    if (results) {
      return responseStandart(res, `All comment id ${id}`, { results })
    }
    return responseStandart(res, `Comment ${id} not found`, {}, 401, false)
  }
}
