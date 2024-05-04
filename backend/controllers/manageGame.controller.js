const AdmZip = require("adm-zip");
const Game = require("../models/game");
const { generateGameId } = require("../utils/generateGameID");
const {
	insertGame,
	addPlayer,
	startDBGame,
	getRandomMessage,
	getPlayersLobby,
} = require("../database/db");

const getPlayers = async (req, res) => {
    console.log('epa', req.body);
    const gameId = req.body.gameId;
    const players = await getPlayersLobby(gameId);
    if (players) {
        res.status(200).json(players).end();
    } else {
        res.status(400).json({ message: "No players found" }).end();
    }
}


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
		const ws = req.ws; // Supongamos que req.ws contiene la conexión WebSocket del cliente
		if (ws) {
			ws.emit("establish-socket-connection");
			console.log("WebSocket connected");
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
		// Enviar mensaje al cliente para establecer la conexión WebSocket
		const ws = req.ws; // Supongamos que req.ws contiene la conexión WebSocket del cliente
		if (ws) {
			ws.emit("establish-socket-connection");
			console.log("WebSocket connected");
		}
		res.status(200).end();
	}
	if (!result.ok) res.status(500).json(result.message).end();
};

const startGame = async (req, res) => {
	const gameId = req.body.gameId;
	const message = await getRandomMessage(gameId);
	const status = startDBGame(gameId, message);

	if (status.ok) {
		// Emitir un evento a todas las conexiones WebSocket activas
		activeSockets.forEach((ws) => {
			ws.emit("game-started", { gameId, message }); // Emitir el evento "game-started" con los datos relevantes
		});

		res.status(200).json({
			message: "El juego ha comenzado correctamente.",
		});
	} else {
		res.status(500).json({ error: "Error al iniciar el juego." });
	}
};

module.exports = { createGame, joinGame, startGame, getPlayers };
