const client = require('prom-client');

// HINT: Consider using unique
let _metrics = [];

/**
 * On Prometheus: Counters go up, and reset when the process restarts.
 * @param {*} metricName 
 * @param {*} metricHelp 
 * @param {*} increase 
 * @returns 
 */
const counter = (metricName, metricHelp, increase) => {
  if (_metrics[metricName]) {
    _metrics[metricName].inc(increase);
  } else {
    _metrics[metricName] = new client.Counter({
      name: metricName,
      help: metricHelp,
    });
    _metrics[metricName].inc(increase);
  }
  return true;
}

module.exports = {
  counter
}
