const Message = require('./message')

class Game {
	constructor(gameId, player) {
		this.gameId = gameId
		this.players = [player];
		this.messages = [];
		this.users = []
		this.filePath = null 
	}

	addMessage(sender, content, isMedia) {
		const message = new Message(sender, content, isMedia);
		this.messages.push(message);
	}

	addUser(username){
		this.users.push(username)
	}

	setFilePath(filePath){
		this.filePath = filePath
	}
}

module.exports = Game;
