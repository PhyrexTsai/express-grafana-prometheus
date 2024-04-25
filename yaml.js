const fs = require('fs');
require('dotenv').config();

let yamlFile = fs.readFileSync('./prometheus-example.yaml', 'utf8');

yamlFile = yamlFile.replace(/\$\{(\w+)\}/g, (_, key) => {
    return process.env[key]
});

fs.writeFileSync('./prometheus.yaml', yamlFile);
