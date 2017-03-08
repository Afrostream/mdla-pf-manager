'use strict';

const assert = require('assert');
const Q = require('q');

module.exports = function (sequelize, DataTypes) {
  const ExportsOCI = sequelize.define('ExportsOCI', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    /**
     * date du lancement de l'export (status=started)
     */
    last: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    type: DataTypes.STRING(16), // episode|serie|movie
    movieId: DataTypes.INTEGER,
    episodeId: DataTypes.INTEGER,
    data: DataTypes.JSON,
    /**
     *  @see README
     *  {
     *    "state":"SUCCESS",
     *    "ingestDateStart":...
     *    "ingestDateEnd":...
     *    "ingestDirty": { xml: true, image: true, video: true }
     *    "errorList": [
     *      {
     *        "type": "unknown|timeout|"
     *        "message": string
     *        "ingestDateStart": ...
     *        "ingestDateEnd": ...
     *      }
     *    ]
     *  }
     */
    status: DataTypes.JSON,
    /**
     * {
     *   xml: null, // boolean  xml a (re-)exporter
     *   image: images a (re-)exporter
     *   video: video a (re-)exporter
     * }
     */
    dirty: DataTypes.JSON
  }, {
    freezeTableName: true,

    getterMethods: {
      state: function () {
        return (this.getDataValue('status') || {}).state;
      }
    },

    setterMethods: {
      state: function (val) {
        const status = this.getDataValue('status') || {};
        status.state = val;
        this.set('status', status);
      }
    },

    instanceMethods: {
      setStateToError: function (type, message) {
        const previousState = this.state;
        return this.setState(ExportsOCI.STATES.ERROR)
          .then(() => {
            const status = this.get('status');
            status.errorList = status.errorList || [];
            status.errorList.push({
              type: type,
              message: message || 'timeout on state ' + previousState,
              date: new Date(),
              ingestDateStart: status.ingestDateStart || 'unknown',
              ingestDateEnd: status.ingestDateEnd || 'unknown'
            });
            this.set('status', status);
            return this.save();
          });
      },

      setState: function (newState) {
        assert(ExportsOCI.STATES[newState], 'unknown state ' + newState);

        console.log('[INFO]: [STATE]: ' + this._id + ' ' + this.state + ' -> ' + newState);
        this.state = newState;
        return this.save();
      },

      getESM: function () {
        const type = this.get('type');

        return Q()
          .then(() => {
            switch (type) {
              case 'episode':
                return getESMFromEpisode(this.get('episodeId'));
              case 'serie':
              case 'movie':
                return getESMFromMovie(this.get('movieId'));
              default:
                throw new Error('unknown type ' + type);
            }
          });
      }
    }
  });

  ExportsOCI.STATES = {
    PENDING_STARTED: 'PENDING_STARTED',
    PENDING_READY_FOR_ZIP: 'PENDING_READY_FOR_ZIP',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    ABORTED: 'ABORTED'
  };

  // fixme: native sequelized possible ?
  ExportsOCI.upsert = function (insert, update) {
    return ExportsOCI.findOne({where: insert})
      .then(exportsOCI => {
        if (!exportsOCI) {
          return ExportsOCI.create(insert);
        }
        return exportsOCI;
      })
      .then(exportsOCI => exportsOCI.update(update));
  };

  return ExportsOCI;
};
