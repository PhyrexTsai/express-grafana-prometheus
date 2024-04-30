const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {register, collectDefaultMetrics} = require('prom-client');
const swaggerUi = require('swagger-ui-express');
const swaggerApiDocument = require('./swagger-api.json');
const { logger } = require('./utils/logs');
const { formatRequestAndResponse } = require('./utils/format');

const indexRouter = require('./routes/index');

const app = express();

// HINT: Collect Timeout
collectDefaultMetrics({ timeout: 5000 });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/api-docs', swaggerUi.serveFiles(swaggerApiDocument, {}), swaggerUi.setup(swaggerApiDocument));

// HINT: Router for Prometheus metrics
app.get('/metrics', async (req, res) => {

  /*
    #swagger.tags = ['Index']
    #swagger.description = 'Endpoint to trace all metric' 
    #swagger.auto = false
    #swagger.path = '/metrics'
    #swagger.method = 'get'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']
  */

  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  if (res.renderPage !== undefined) {
    logger.info(formatRequestAndResponse(req, res));
    return res.render(res.renderPage, res.payload);
  } else if (res.payload !== undefined) {
    logger.info(formatRequestAndResponse(req, res));
    return res.json(res.payload);
  } else {
    next(createError(404));
  }
  
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  logger.info(formatRequestAndResponse(req, res));
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
