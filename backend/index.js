const express = require("express");
const app = express();

const PORT = 3000;

app.use(express.json());

// Upload file endpoint
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const uploadFile = () => {};

app.use('upload', uploadFile )

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
