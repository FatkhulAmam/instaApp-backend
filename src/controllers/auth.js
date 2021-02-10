/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const joi = require('joi')
const responseStandart = require('../helpers/response')
const { user } = require('../models')

module.exports = {
  loginUser: async (req, res) => {
    const data = await user.findOne({ where: { email: req.body.email } })
    if (data !== null) {
      const compared = await bcrypt.compare(req.body.password, data.password)
      if (compared === true) {
        jwt.sign({ id: data.id }, process.env.APP_KEY, (err, token) => {
          if (err) {
            return responseStandart(res, 'Error', { error: err.message }, 500, false)
          }
          return responseStandart(res, `Hello user ${data.id}`, { token })
        })
      } else {
        return responseStandart(res, 'Wrong password', {}, 400, false)
      }
    } else {
      return responseStandart(res, 'wrong email or password', {}, 400, false)
    }
  },
  registrasiUser: async (req, res) => {
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
    if (!error) {
      const salt = bcrypt.genSaltSync(10)
      const hashedPass = bcrypt.hashSync(results.password, salt)
      const dataUser = {
        name: results.name,
        email: results.email,
        password: hashedPass
      }
      await user.create(dataUser)
      return responseStandart(res, 'register success', {})
    }
    return responseStandart(res, 'error', {}, 401, false)
  }
}
