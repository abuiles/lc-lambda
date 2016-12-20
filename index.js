'use strict';
var fs = require('fs');
var async = require('async');
var aws = require('aws-sdk');
var sqs = new aws.SQS({apiVersion: '2012-11-05'});
var ecs = new aws.ECS({apiVersion: '2014-11-13'});
var config = require('./config').config;

exports.handler = function(event, context) {
  console.log('Received event:');
  console.log(JSON.stringify(event, null, '  '));

  console.log('Config: ', config);

  async.waterfall([
    function (next) {
      var params = {
        MessageBody: JSON.stringify(event),
        QueueUrl: config.queue
      };
      sqs.sendMessage(params, function (err, data) {
        if (err) {
          console.warn('Error while sending message: ' + err);
        } else {
          console.info('Message sent, ID: ' + data.MessageId);
        }

        next(err);
      });
    }
  ], function (err) {
    if (err) {
      context.fail('An error has occurred: ' + err);
    }
    else {
      context.succeed('Successfully processed Amazon S3 URL.');
    }
  });
};
