const express = require("express");
const router = express.Router();
const {
	createGame,
	joinGame,
} = require("../controllers/manageGame.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-game", upload.single("zip"), createGame);
router.post("/join-game", joinGame);

module.exports = router;
