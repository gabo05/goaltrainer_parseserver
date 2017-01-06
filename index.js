var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();
var api = new ParseServer({
	serverURL: 'https://goaltrainerps.herokuapp.com/parse',
	databaseURI: databaseUri || 'mongodb://localhost:27017/dev'
  	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	appId: process.env.APP_ID || 'myAppId',
	fileKey: 'myFileKey',
	masterKey: process.env.MASTER_KEY || 'myMasterKey'/*,
	push: {}, // See the Push wiki page
	filesAdapter:{}*/
});
var mountPath = process.env.PARSE_MOUNT || '/parse';
// Serve the Parse API at /parse URL prefix
app.use(mountPath, api);

var port = 1337;
app.listen(port, function() {
	console.log('parse-server running on port ' + port + '.');
});