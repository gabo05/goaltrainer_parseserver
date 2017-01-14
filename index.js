var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
	serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', 
	databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	appId: process.env.APP_ID || 'myAppId',
	fileKey: 'myFileKey',
	masterKey: process.env.MASTER_KEY || 'myMasterKey',
	push: {
		android: {
        senderId: process.env.GCM_SENDERID || '',
        apiKey: process.env.GCM_APIKEY || ''
      }
	}/*, // See the Push wiki page
	filesAdapter:{}*/
});

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

var mountPath = process.env.PARSE_MOUNT || '/parse';
// Serve the Parse API at /parse URL prefix
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.status(200).send('Goal Trainer Api');
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server running on port: ' + port + '.');
});