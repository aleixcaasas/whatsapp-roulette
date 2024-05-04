const Message = require('./message')

class Game {
	constructor(users) {
		this.users = users;
		this.messages = [];
	}

	addMessage(sender, content, isMedia) {
		const message = new Message(sender, content, isMedia);
		this.messages.push(message);
	}
}

module.exports = Game;
