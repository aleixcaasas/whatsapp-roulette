const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = 3000;
const routes = require("./routes/routes.js"); // Se importan las rutas correctamente
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use("/", routes);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

const WebSocket = require("ws");
/*const wss = new WebSocket.Server({ server });

const activeSockets = [];
wss.on("connection", (ws) => {
	console.log("Cliente conectado");
	activeSockets.push(ws);

	// Manejar mensajes entrantes desde el cliente
	ws.on("message", (message) => {
		console.log(`Mensaje recibido: ${message}`);

		// Aquí puedes agregar la lógica para procesar y responder a los mensajes recibidos desde el cliente
		// Por ejemplo:
		// ws.send("Mensaje recibido correctamente");
	});

	// Manejar eventos de cierre de conexión
	ws.on("close", () => {
		console.log("Cliente desconectado");
		activeSockets.splice(activeSockets.indexOf(ws), 1);
	});
});*/
