/**
 * Rabbit MQ Message Types
 * @type {{JOB_ERROR: string, JOB_CREATED: string, JOB_RESTART: string, JOB_STARTED: string}}
 */
const MESSAGES = {
  JOB_ERROR: 'pf.job.error',
  JOB_CREATED: 'pf.job.created',
  JOB_RESTART: 'pf.job.restart',
  JOB_READY: 'pf.job.ready',
  JOB_STARTED: 'pf.job.started'
};

/**
 * Job status list
 * @type {{PENDING: string, PREPROCESSING: string, RUNNING: string, POSTPROCESSING: string, COMPLETE: string, CANCELLED: string, ERROR: string, SOMEOTHERSTATUS: string}}
 */
const JOB_STATUS = {
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
};

module.exports.MESSAGES = MESSAGES;
module.exports.JOB_STATUS = JOB_STATUS;