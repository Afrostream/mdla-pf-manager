'use strict';

/*
 * Please use: npm run staging
 */

// RUN the dev code with NODE_ENV=staging.
process.env.NODE_ENV = 'staging';
process.env.PORT = '6003';
process.env.DATABASE_URL='postgres://u4fp4ad34q8qvi:pt7eht3e9v3lnehhh27m7sfeol@ec2-54-228-194-210.eu-west-1.compute.amazonaws.com:5522/d71on7act83b7i';

// App boostrap.
// no cluster, single-worker
require('./worker.js');