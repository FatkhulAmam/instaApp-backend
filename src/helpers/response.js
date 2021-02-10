// eslint-disable-next-line max-len
module.exports = (res, message, additionalData = {}, status = 200, success = true) => res.status(status).send({
  success,
  message: message || 'Success',
  ...additionalData,
});
