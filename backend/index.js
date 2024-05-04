const express = require("express");
const app = express();
const morgan = require("morgan");

const PORT = 3000;
const routes = require("./routes/routes.js"); // Se importan las rutas correctamente

app.use(express.json());

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/", routes); // Se utiliza el objeto de rutas importado correctamente

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
