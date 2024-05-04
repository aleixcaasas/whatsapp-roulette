function generateGameId() {
	// Generar un número aleatorio entre 0 y 99999
	let gameId = Math.floor(Math.random() * 100000);

	// Asegurarse de que tenga exactamente 5 dígitos
	gameId = gameId.toString().padStart(5, "0");

	return gameId;
}

module.exports = { generateGameId };
