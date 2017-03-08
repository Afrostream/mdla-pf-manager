'use strict';

const _ = require('lodash');
const sqldb = rootRequire('sqldb');
const PFManagerBroadcaster = sqldb.PFManagerBroadcaster;

module.exports.addBroadcasters = function (updates) {
  const broadcasters = PFManagerBroadcaster.build(_.map(updates.broadcasters || [], _.partialRight(_.pick, '_id')));
  return entity => entity.setBroadcasters(broadcasters)
    .then(() => entity);
};

module.exports.responseWithResult = function (req, res, statusCode) {
  statusCode = statusCode || 200;
  return entity => {
    res.set('afr-output-filtered', 'true');
    res.status(statusCode).json(entity);
  };
};

module.exports.handleEntityNotFound = () => {
  return entity => {
    if (!entity) {
      const error = new Error("entity not found");
      error.statusCode = 404;
      throw error;
    }
    return entity;
  };
};

module.exports.removeEntity = (res) => {
  return entity => {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
};

module.exports.saveUpdates = (updates) => {
  return entity => entity.updateAttributes(updates);
};

module.exports.handleError = (res, statusCode) => {
  statusCode = statusCode || 500;
  return (err) => {
    res.status(statusCode).json({
      code: err.code,
      message: err.message
    });
  };
};


module.exports.middlewareCache = (req, res, next) => {
  res.cache();
  next();
};

module.exports.middlewareNoCache = (req, res, next) => {
  res.noCache();
  next();
};

