class Message {
	constructor(sender, content, isMedia) {
		this.sender = sender;
		this.content = content;
		this.isMedia = isMedia;
	}
}

module.exports = Message;