const express = require("express");
const router = express.Router();
const {
	createGame,
	joinGame,
    startGame
} = require("../controllers/manageGame.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-game", upload.single("zip"), createGame);
router.post("/join-game", joinGame);
router.post("/start-game", startGame)

module.exports = router;
