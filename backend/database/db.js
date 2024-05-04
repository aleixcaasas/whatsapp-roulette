const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const connectDB = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://acasasbarco:NMVHhI3Wyp67Yibx@database.fvxjvmg.mongodb.net/?retryWrites=true&w=majority&appName=database",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log("Db connected");
	} catch (error) {
		console.log(error);
	}
};

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
	} catch (error) {
		console.error("Error al insertar el juego:", error);
	} finally {
		await client.close();
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
			{ $addToSet: { players: username } } // Añadir el jugador si no está presente en la lista de usuarios
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

module.exports = { connectDB, insertGame, addPlayer };
