const AdmZip = require("adm-zip");
const Game = require("../models/game");
const { generateGameId } = require("../utils/generateGameID");
const {
	insertGame,
	addPlayer,
	startDBGame,
	getRandomMessage,
} = require("../database/db");

const createGame = async (req, res) => {
	// Verificar si se ha cargado un archivo correctamente
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const player = req.body.username;
	if (!player)
		res.status(500).json({ message: "Error creating game. Try Again" });

	const zipBuffer = req.file.buffer;

	// Crear una instancia de AdmZip con el contenido del archivo ZIP en memoria
	const zip = new AdmZip(zipBuffer);

	// Obtener todas las entradas del archivo ZIP
	const zipEntries = zip.getEntries();

	const gameId = generateGameId();
	// Estructura de datos para almacenar los mensajes
	const game = new Game(gameId, player);

	// Iterar sobre cada entrada del archivo ZIP
	zipEntries.forEach((entry) => {
		// Verificar si la entrada es el archivo de mensajes "_chat.txt"
		if (entry.entryName === "_chat.txt") {
			// Leer el contenido del archivo
			const content = entry.getData().toString("utf8");
			// Dividir el contenido en líneas
			const lines = content.split("\n");
			// Iterar sobre cada línea para procesar los mensajes
			lines.forEach((line) => {
				// Analizar la línea para extraer la información del mensaje
				const match = /\[(.*?)\] (.*?): ‎<adjunto: (.*)>/.exec(line);
				if (match) {
					// Obtener el contenido del mensaje
					const content = match[3];
					const user = match[2];

					// Comporbar si el usuario está en la lista
					if (!game.users.includes(user)) {
						game.addUser(user);
					}

					// Crear un objeto con la información del mensaje y guardarlo en la estructura de datos
					game.addMessage(user, content, true);
				} else {
					// Analizar la línea para extraer la información del mensaje
					const match = /\[(.*?)\] (.*?): (.*)/.exec(line);
					if (match) {
						// Obtener el contenido del mensaje
						const content = match[3];
						const user = match[2];

						// Comporbar si el usuario está en la lista
						if (!game.users.includes(user)) {
							game.addUser(user);
						}
						// Crear un objeto con la información del mensaje y guardarlo en la estructura de datos
						game.addMessage(user, content, false);
					}
				}
			});
		}
	});

	const status = await insertGame(game);

	if (status == true) {
		// Obtener el WebSocket del usuario que creó el juego
		const ws = req.ws; // Supongamos que req.ws contiene la conexión WebSocket del usuario
		if (ws) {
			// Enviar un mensaje al usuario para establecer la conexión WebSocket
			ws.send("¡Juego creado! Estableciendo conexión WebSocket...");
		}
		// Enviar respuesta a la petición HTTP
		res.status(201).json({ gameId }).end();
	} else {
		res.status(500)
			.json({ message: "Error creating game. Try Again" })
			.end();
	}
};

const joinGame = async (req, res) => {
	const gameId = req.body.gameId;
	const username = req.body.username;

	const result = await addPlayer(gameId, username);

	if (result.ok == true) {
		// Obtener el WebSocket del usuario que se une al juego
		const ws = req.ws; // Supongamos que req.ws contiene la conexión WebSocket del usuario
		if (ws) {
			// Enviar un mensaje al usuario para establecer la conexión WebSocket
			ws.send(
				"¡Te has unido al juego! Estableciendo conexión WebSocket..."
			);
		}
		res.status(200).end();
	}
	if (!result.ok) res.status(500).json(result.message).end();
};

const startGame = async (req, res) => {
	const gameId = req.body.gameId;
	const message = await getRandomMessage(gameId);
	startDBGame(gameId, message);
};

module.exports = { createGame, joinGame, startGame };