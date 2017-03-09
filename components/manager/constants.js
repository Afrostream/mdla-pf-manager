/**
 * Rabbit MQ Message Types
 * @type {{JOB: {ERROR: string, CREATED: string, RESTART: string, READY: string, STARTED: string}, BID: {OFFER: string, ACCEPTED: string}}}
 */
const MESSAGES = {
  JOB: {
    ERROR: 'pfmanager.job.error',
    CREATED: 'pfmanager.job.created',
    RESTART: 'pfmanager.job.restart',
    READY: 'pfmanager.job.ready',
    STARTED: 'pfmanager.job.started'

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
  JOB: {
    PENDING: 'pending',//Added to pipeline
    DOWNLOADING: 'Downloading',//Download file to current PF
    READY: 'ready',//Ready to process job
    WAITING: 'waiting',//Waiting for encoder init
    PREPROCESSING: 'preprocessing',//Waiting for encoder (copy files ...) merge( DOWNLOADING, READY, WAITING )
    RUNNING: 'running',//Processing transcode
    SAVING: 'saving',//Save files to output
    POSTPROCESSING: 'postprocessing',//Saving file output (Saving)
    COMPLETE: 'complete',//Transcode Finished
    CANCELLED: 'cancelled',//Cancelled from user
    ERROR: 'error',//Error (see Job.statusMessage
    SOMEOTHERSTATUS: 'someotherstatus',//Some Other Status from current PF...
  }
};

module.exports.MESSAGES = MESSAGES;
module.exports.STATUS = STATUS;