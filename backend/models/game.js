const Message = require('./message')

class Game {
	constructor(gameId ,player) {
		this.gameId = gameId
		this.players = [player];
		this.messages = [];
		this.users = []
	}

	addMessage(sender, content, isMedia) {
		const message = new Message(sender, content, isMedia);
		this.messages.push(message);
	}

	addUser(username){
		this.users.push(username)
	}
}

module.exports = Game;
