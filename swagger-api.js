const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: '1.0.0',
    title: 'Express Grafana Prometheus API',
    description: 'Swagger UI for API',
  },
  host: '',
  basePath: '/',
  schemes: [],   // by default: ['http']
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [],
  security: [],
  definitions: {},
  components: {},
};

const outputFile = './swagger-api.json';
const endpointsFiles = [
  'app.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
