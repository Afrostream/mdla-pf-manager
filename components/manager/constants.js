/**
 * Rabbit MQ Message Types
 * @type {{JOB: {ERROR: string, CREATED: string, RESTART: string, READY: string, STARTED: string}, BID: {OFFER: string, ACCEPTED: string}}}
 */
const MESSAGES = {
  JOB: {
    ERROR: 'pfmanager.job.error',
    CREATE: 'pfmanager.job.create',
    RESTART: 'pfmanager.job.restart',
    READY: 'pfmanager.job.ready',
    STARTED: 'pfmanager.job.started',
    REMOVED: 'pfmanager.job.removed',
    UPDATED_STATUS: 'pfmanager.job.updated.status'
  },
  PRESET: {
    ERROR: 'pfmanager.preset.error',
    CREATE: 'pfmanager.preset.create',
    READY: 'pfmanager.preset.ready',
    REMOVED: 'pfmanager.job.removed',
    UPDATED_STATUS: 'pfmanager.job.updated.status'
  },
  BID: {
    OFFER: 'pfmanager.bid.offer',
    ACCEPTED: 'pfmanager.bid.accepted',
  }
};

/**
 * APP STATUS
 * @type {{JOB: {PENDING: string, DOWNLOADING: string, READY: string, WAITING: string, PREPROCESSING: string, RUNNING: string, SAVING: string, POSTPROCESSING: string, COMPLETE: string, CANCELLED: string, ERROR: string, SOMEOTHERSTATUS: string}}}
 */
const STATUS = {
  PRESET: {
    PENDING: 'pending',
    ERROR: 'error',
    READY: 'ready'
  },
  JOB: {
    PENDING: 'pending',//Added to pipeline
    DOWNLOADING: 'downloading',//Download file to current PF
    READY: 'ready',//Ready to process job
    WAITING: 'waiting',//Waiting for encoder init
    PREPROCESSING: 'preprocessing',//Waiting for encoder (copy files ...) merge( DOWNLOADING, READY, WAITING )
    RUNNING: 'running',//Processing transcode
    SAVING: 'saving',//Save files to output
    POSTPROCESSING: 'postprocessing',//Saving file output (Saving)
    COMPLETE: 'complete',//Transcode Finished
    CANCELLED: 'cancelled',//Cancelled from user
    ERROR: 'error',//Error (see Job.statusMessage)
    SOMEOTHERSTATUS: 'someotherstatus',//Some Other Status from current PF...
  }
};

module.exports.MESSAGES = MESSAGES;
module.exports.STATUS = STATUS;