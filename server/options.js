// Read a json file and parse it
var fs = require('fs');
var configFile = './config.json';
var parsed = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
exports.storageConfig = parsed;
