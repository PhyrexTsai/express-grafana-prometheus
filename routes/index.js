const express = require('express');
const router = express.Router();
const { counter } = require('../utils/prometheus');
const { logger } = require('../utils/logs');
const createError = require('http-errors');

/**
 * Index Page
 */
router.get('/', function(req, res, next) {
  // #swagger.ignore = true
  res.render('index', { title: 'Express' });
});

router.get('/log', function(req, res, next) {

  /*
    #swagger.tags = ['Index']
    #swagger.description = 'Endpoint to send log message' 
    #swagger.auto = false
    #swagger.path = '/log'
    #swagger.method = 'get'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']
    #swagger.parameters['message'] = {
      in: 'query',
      type: 'string',
      description: 'Message',
      required: false
    }
  */
  
  try {
    res.payload = { success: true };
    if (!req.query.message) {
      logger.error('Missing Message');
      res.payload = { success: false };
    }
  } catch (error) {
    logger.error(`[API] ROUTER: ${req.method} ${req.originalUrl}, ERROR:`, error);
    return next(createError(error.status, error.message));
  }
  next();
});

/**
 * Counter API
 */
router.get('/counter', function(req, res, next) {

  /*
    #swagger.tags = ['Index']
    #swagger.description = 'Endpoint to add counter to metric' 
    #swagger.auto = false
    #swagger.path = '/counter'
    #swagger.method = 'get'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']
    #swagger.parameters['metricName'] = {
      in: 'query',
      type: 'string',
      description: 'Metrci Name',
      required: false
    },
    #swagger.parameters['metricHelp'] = {
      in: 'query',
      type: 'string',
      description: 'Metric Help Information',
      required: false
    }
    #swagger.parameters['increase'] = {
      in: 'query',
      type: 'integer',
      description: 'Increase counter',
      required: true
    }
  */

  try {
    const metricName = req.query.metricName || 'metric_counter';
    const metricHelp = req.query.metricHelp || 'metric_counter_help';
    const increase = parseInt(req.query.increase);
    const result = counter(metricName, metricHelp, increase);

    res.payload = {
      success: result
    };
  } catch (error) {
    logger.error(`[API] ROUTER: ${req.method} ${req.originalUrl}, ERROR:`, error);
    return next(createError(error.status, error.message));
  }
  next();
});

module.exports = router;
