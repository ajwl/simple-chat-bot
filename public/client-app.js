const socket = io('?botmasterUserId=wantedUserId');
const mInput = document.querySelectorAll('#m')[0];
const messageBox = document.getElementById('messages');
const formElement = document.querySelector('form');

formElement.onsubmit = function(e){
	event.preventDefault();
	if(!mInput.value) return;
	const update = {
		message: {
			text: mInput.value
		}
	}
	socket.send(update);
	addMessage(mInput.value, 'user');
	mInput.value = '';
};

socket.on('message', (botmsg) => {
	let botMessage = botmsg.message.text;
	addMessage(botMessage, 'bot');
});

const addMessage = (msg, sender) => {
	let item = document.createElement("li");
	item.setAttribute("class", sender);
	item.textContent = msg;
	messageBox.appendChild(item);
};
