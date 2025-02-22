const { clearHash } = require('../services/cache');

/**
 * Clean the cache *after* the route handler has been executed.
 * @param {Request} req The request object.
 * @param {Response} _ The response object.
 * @param {NextFunction} next The next-function.
 */
const cleanCache = async (req, _, next) => {
  await next();

  clearHash(req.user._id);
};

module.exports = cleanCache;
