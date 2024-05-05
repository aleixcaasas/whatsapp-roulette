const fs = require("fs");
const path = require("path");

const AdmZip = require("adm-zip");
const Game = require("../models/game");
const { generateGameId } = require("../utils/generateGameID");
const {
	insertGame,
	addPlayer,
	startDBGame,
	getNextRoundMessage,
	getPlayersLobby,
	getGame,
	saveVote,
} = require("../database/db");

const getPlayers = async (req, res) => {
	const gameId = req.body.gameId;
	const players = await getPlayersLobby(gameId);
	if (players) {
		res.status(200).json(players).end();
	} else {
		res.status(400).json({ message: "No players found" }).end();
	}
};

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

	// Crear el directorio temp si no existe
	const tempDir = path.join(__dirname, "temp");
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir);
	}

	// Almacenar el archivo cargado en una ubicación temporal
	const filePath = path.join(__dirname, "temp", gameId + ".zip");
	console.log(filePath);
	fs.writeFileSync(filePath, zipBuffer);
	game.setFilePath(filePath);

	const status = await insertGame(game);

	if (status == true) {
		// Obtener el WebSocket del usuario que creó el juego
		/*const ws = req.ws; // Supongamos que req.ws contiene la conexión WebSocket del cliente
		if (ws) {
			ws.emit("establish-socket-connection");
			console.log("WebSocket connected");
		}*/
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
		res.status(200).json(result).end();
	}
	if (!result.ok) res.status(500).json(result.message).end();
};

const startGame = async (req, res) => {
	const gameId = req.body.gameId;
	const status = await startDBGame(gameId);

	const game = await getGame(gameId);
	if (status.ok) {
		res.status(200)
			.json({
				ok: true,
				message: "El juego ha comenzado correctamente.",
				users: game.game.users.splice(1, game.game.users.length - 1),
			})
			.end();
	} else {
		res.status(500)
			.json({ ok: false, error: "Error al iniciar el juego." })
			.end();
	}
};

const getNewRoundData = async (req, res) => {
	const gameId = req.query.gameId;
	const roundData = await getNextRoundMessage(gameId);

	if (roundData) {
		if (roundData.message.isMedia) {
			const game = await getGame(gameId);
			const zip = new AdmZip(game.game.filePath);

			const mediaFile = zip.getEntry(roundData.message.content);
			if (mediaFile) {
				const mediaContent = mediaFile.getData();
				res.setHeader("Content-Type", "application/octet-stream");
				res.send(mediaContent);
			} else {
				res.status(404).json({ message: "Media file not found" }).end();
			}
		} else {
			res.status(200).json(roundData).end();
		}
	} else {
		res.status(400).json({ message: "No round data found" }).end();
	}
};

const registerVote = async (req, res) => {
	const gameId = req.body.gameId;
	const username = req.body.player;
	const vote = req.body.vote;

	const game = await getGame(gameId);

	if (game) {
		const rounds = game.game.rounds;
		// Suponiendo que quieres votar en la última ronda, ajusta según tus necesidades
		if (rounds.length === 0) {
			res.status(400).json({ message: "No rounds found" }).end();
			return;
		}
		const lastRoundIndex = rounds.length - 1;
		const lastRound = rounds[lastRoundIndex];

		if (lastRound) {
			console.log(lastRound);
			const updatedVotes = lastRound.votes.map((player) => {
				if (player.player === username) {
					return { ...player, vote: vote }; // Actualizar el voto del jugador encontrado
				}
				return player; // Devolver el jugador sin cambios si no es el jugador buscado
			});
			console.log(updatedVotes);

			const status = await saveVote(gameId, updatedVotes);
			if (!status.ok) {
				res.status(500).json({ message: "Error saving vote" }).end();
				return;
			}
			
			// Si se encontró el jugador y se actualizó su voto
			lastRound.votes = updatedVotes; // Actualizar el arreglo de votos en el objeto lastRound
			res.status(200).json({ ok: true }).end();
		} else {
			res.status(400).json({ message: "Round not found" }).end();
		}
	} else {
		res.status(400).json({ message: "Game not found" }).end();
	}
};

module.exports = {
	createGame,
	joinGame,
	startGame,
	getPlayers,
	getNewRoundData,
	registerVote,
};
