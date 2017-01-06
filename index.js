var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();
var api = new ParseServer({
	serverURL: 'https://goaltrainerps.herokuapp.com/parse',
	databaseURI: databaseUri || 'mongodb://gtappuser:Gtdu0106@ds157268.mlab.com:57268/goaltrainer',
  	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	appId: process.env.APP_ID || 'BEGT05013024',
	fileKey: 'FKGT0501',
	masterKey: process.env.MASTER_KEY || 'La2417_KmS30==DHM'/*,
	push: {}, // See the Push wiki page
	filesAdapter:{}*/
});
var mountPath = process.env.PARSE_MOUNT || '/parse';
// Serve the Parse API at /parse URL prefix
app.use(mountPath, api);

var port = 1337;
app.listen(port, function() {
	console.log('parse-server-example running on port ' + port + '.');
});