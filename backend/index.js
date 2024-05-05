const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/routes.js");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	}});

const PORT = 4000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: false,
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.options("*", cors());

// Mantener una lista de conexiones WebSocket activas
const activeSockets = [];

/*// WebSocket middleware
const attachWebSocket = (io) => {
	return (req, res, next) => {
		req.ws = io; // Adjunta el objeto io al objeto de solicitud req
		next();
	};
};
app.use(attachWebSocket(io));*/

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use("/", routes);

// Manejar conexiones WebSocket entrantes
io.on("connection", (socket) => {
	console.log("Un cliente se ha conectado");

	/*// Agregar la conexión WebSocket activa a la lista
	activeSockets.push(socket);*/
	socket.on('join-game', (data) => { //quan un usuari es connecta a una partida ho commentem a tots!
		io.emit('epa', data);
	});

	socket.on('new-round', (data) => { //quan un usuari es connecta a una partida ho commentem a tots!
		io.emit('start', data);
	});
	// Manejar evento de desconexión
	socket.on("disconnect", () => {
		console.log("Un cliente se ha desconectado");
		// Remover la conexión WebSocket de la lista cuando se cierre
		activeSockets.splice(activeSockets.indexOf(socket), 1);
	});
});



// Endpoint para enviar un evento a todos los clientes conectados
app.post("/api/sendEvent", (req, res) => {
	try {
		// Obtener los datos del evento desde la solicitud HTTP
		const eventData = req.body;

		// Enviar el evento a todas las conexiones WebSocket activas
		activeSockets.forEach((socket) => {
			socket.emit("event", eventData);
		});

		// Respuesta del servidor
		res.status(200).json({
			message: "Evento enviado exitosamente a todos los clientes.",
		});
	} catch (error) {
		console.error("Error al enviar el evento:", error);
		res.status(500).json({ error: "Error al enviar el evento." });
	}
});

server.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});
