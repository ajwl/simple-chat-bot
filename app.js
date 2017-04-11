const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 8000;
const io = require('socket.io')(http);

const Botmaster = require('botmaster');
const SocketBot = require('botmaster-socket.io');
const SessionWare = require('botmaster-session-ware');
const WatsonConversationWare = require('./botmaster-watson-conversation-ware');

app.use(express.static(__dirname + '/public'));

const server = http.listen(port, '0.0.0.0', () => {
	console.log('listening on %d', port);
});

const socketBotSettings = {
	id: 'CHARTDOCTOR',
	server
}

const watsonConversationWareOptions = {
	settings: {
		username: "",
		password: "",
		version: 'v1',
		version_date: '2017-02-03',
	},
	workspaceId: ""
}

const botmaster = new Botmaster();
const mySocketBot = new SocketBot(socketBotSettings);
botmaster.addBot(mySocketBot);

const watsonConversationWare = WatsonConversationWare(watsonConversationWareOptions);
botmaster.use(watsonConversationWare);


botmaster.on('error', (bot, err) => {
	console.log(err.stack);
});

botmaster.use({
	type: 'incoming',
	name: 'my-watson-controller',
	controller: (bot, update) => {
		return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
	}
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

const sessionWare = SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);

