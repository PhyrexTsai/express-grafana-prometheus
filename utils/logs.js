const { createLogger, transports, format } = require("winston");
const LokiTransport = require("winston-loki");
require('dotenv').config();

let _logger = null;

const initializeLogger = () => {
  if (_logger) {
    return _logger;
  }

  _logger = createLogger({
    transports: [
      // HINT: Send log to Grafana Loki
      new LokiTransport({
        host: `https://${process.env.GRAFANA_CLOUD_LOKI_URL}`,
        labels: { app: `${process.env.APP_NAME}` },
        json: true,
        format: format.json(),
        replaceTimestamp: true,
        basicAuth: `${process.env.GRAFANA_CLOUD_LOKI_USER}:${process.env.GRAFANA_CLOUD_LOKI_PASSWORD}`,
        onConnectionError: (err) => console.error(err)
      }),
      // HINT: Save log to local file
      new transports.File({
        filename: './logs/server.log',
        level: 'debug'
      }),
      // HINT: Print log to console
      new transports.Console({
        format: format.combine(format.simple(), format.colorize())
      }),
    ]
  });

  return _logger;
}

initializeLogger();

module.exports = {
  logger: _logger
}
