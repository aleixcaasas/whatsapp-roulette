const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

// URL de conexión a la base de datos de MongoDB Atlas
const uri =
	"mongodb+srv://acasasbarco:NMVHhI3Wyp67Yibx@database.fvxjvmg.mongodb.net/?retryWrites=true&w=majority&appName=database";

// Nombre de la colección en la que deseas insertar el juego
const collectionName = "games";

async function insertGame(game) {
	const client = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	try {
		await client.connect();
		const database = client.db(); // Obtiene la base de datos especificada en la URI
		const collection = database.collection(collectionName);

		// Insertar el juego en la colección
		const result = await collection.insertOne(game);
		console.log(`El juego se ha insertado con el ID: ${result.insertedId}`);
		return true;
	} catch (error) {
		console.error("Error al insertar el juego:", error);
		return false;
	} finally {
		await client.close();
	}
}
async function getPlayersLobby(gameId) {
	const client = new MongoClient(uri);
	try {
		await client.connect();
		const database = client.db();
		const collection = database.collection(collectionName);
		const result = await collection.find({ gameId: gameId }).toArray();
		const players = result.map((doc) => doc.players);
		return players; // Devuelve el array de jugadores al llamador
	} catch (error) {
		console.log("Error en getPlayersLobby:", error);
		throw error; // Lanza el error para manejarlo en la función de llamada si es necesario
	} finally {
		await client.close(); // Asegúrate de cerrar el cliente MongoDB después de su uso
	}
}

async function addPlayer(gameId, username) {
	const client = new MongoClient(uri);

	try {
		await client.connect();

		const database = client.db(); // Obtiene la base de datos especificada en la URI
		const collection = database.collection(collectionName);

		// Buscar el juego por su ID y actualizar la lista de usuarios
		const result = await collection.updateOne(
			{ gameId: gameId },
			{ $push: { players: username } } // Añadir el jugador si no está presente en la lista de usuarios
		);

		if (result.modifiedCount === 1) {
			console.log(
				`Usuario ${username} añadido al juego con ID ${gameId}`
			);
			return { ok: true };
		} else {
			console.log(`No se encontró ningún juego con el ID ${gameId}`);
			return { ok: false, message: "No game Id" };
		}
	} catch (error) {
		console.error("Error al añadir jugador al juego:", error);
		return { ok: false, message: "Error adding player" };
	} finally {
		await client.close();
	}
}

async function startGame(gameId) {
	const client = new MongoClient(uri);
	console.log("gameId", gameId);

	try {
		await client.connect();

		const database = client.db(); // Obtiene la base de datos especificada en la URI
		const collection = database.collection(collectionName);

		// Buscar el juego por su ID y actualizar el estado del juego
		const result = await collection.updateOne(
			{ gameId: gameId },
			{
				$set: {
					isGameStarted: true,
					rounds: [],
				},
			}
		);

		if (result.modifiedCount === 1) {
			console.log(`Juego con ID ${gameId} iniciado correctamente`);
			return { ok: true };
		} else {
			console.log(`No se encontró ningún juego con el ID ${gameId}`);
			return { ok: false, message: "No game Id" };
		}
	} catch (error) {
		console.error("Error al iniciar el juego:", error);
		return { ok: false, message: "Error starting game" };
	} finally {
		await client.close();
	}
}

async function getRandomMessage(gameId) {
	const client = new MongoClient(uri);

	try {
		await client.connect();

		const database = client.db(); // Obtiene la base de datos especificada en la URI
		const collection = database.collection(collectionName);

		// Buscar el juego por su ID
		const game = await collection.findOne({
			gameId: gameId,
		});

		if (!game) {
			console.log(`No se encontró ningún juego con el ID ${gameId}`);
			return { ok: false, message: "No game found" };
		}

		// Obtener la lista de mensajes del juego
		const messages = game.messages;

		// Seleccionar un mensaje aleatorio
		const randomIndex = Math.floor(Math.random() * messages.length);
		const randomMessage = messages[randomIndex];

		console.log("Mensaje aleatorio seleccionado:", randomMessage);

		return { ok: true, message: randomMessage };
	} catch (error) {
		console.error("Error al obtener mensaje aleatorio:", error);
		return { ok: false, message: "Error getting random message" };
	} finally {
		await client.close();
	}
}

module.exports = {
	insertGame,
	addPlayer,
	startDBGame: startGame,
	getRandomMessage,
	getPlayersLobby,
};
