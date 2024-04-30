const formatUserAgent = (req) => {
  return `USER_AGENT: ${req.headers['user-agent']}`;
}

const formatIP = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
  return `IP: ${ip}`;
}

const formatPath = (req) => {
  return `PATH: ${req.method} ${req.originalUrl}`;
}

const formatRequestAndResponse = (req, res) => {
  const payload = req.query || req.body || req.params;
  return `[API] ${formatPath(req)}, ${formatIP(req)}, ${formatUserAgent(req)}, REQUEST: ${JSON.stringify(payload)}, RESPONSE: ${JSON.stringify(res.payload)}`;
}

module.exports = {
  formatRequestAndResponse,
}
