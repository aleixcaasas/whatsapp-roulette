const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const AdmZip = require("adm-zip");
const Game = require("../models/game");
const Message = require("../models/message");

const uploadFile = (req, res) => {
	// Verificar si se ha cargado un archivo correctamente
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const zipBuffer = req.file.buffer;

	// Crear una instancia de AdmZip con el contenido del archivo ZIP en memoria
	const zip = new AdmZip(zipBuffer);

	// Obtener todas las entradas del archivo ZIP
	const zipEntries = zip.getEntries();

	// Estructura de datos para almacenar los mensajes
	const game = new Game([]);

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
					// Crear un objeto con la información del mensaje y guardarlo en la estructura de datos
					game.addMessage(match[2], content, true);
				} else {
					// Analizar la línea para extraer la información del mensaje
					const match = /\[(.*?)\] (.*?): (.*)/.exec(line);
					if (match) {
						// Obtener el contenido del mensaje
						const content = match[3];
						// Crear un objeto con la información del mensaje y guardarlo en la estructura de datos
						game.addMessage(match[2], content, false);
					}
				}
			});
		}
	});

	// Devolver los mensajes procesados en la respuesta
	res.json(game);
};

module.exports = uploadFile;
