const express = require("express");
const app = express();
const morgan = require("morgan");

const PORT = 3000;
const routes = require("./routes/routes.js"); // Se importan las rutas correctamente
const bodyParser = require("body-parser");

const { connectDB } = require("./database/db.js");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/", routes); // Se utiliza el objeto de rutas importado correctamente

//connectDB();

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
