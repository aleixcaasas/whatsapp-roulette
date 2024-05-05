const express = require("express");
const router = express.Router();
const {
	createGame,
	joinGame,
    startGame,
	getPlayers,
	getNewRoundData,
	registerVote
} = require("../controllers/manageGame.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-game", upload.single("zip"), createGame);
router.post("/join-game", joinGame);
router.post("/start-game", startGame);
router.post("/lobby", getPlayers);
router.get("/new-round", getNewRoundData);
router.post("/vote", registerVote);

module.exports = router;
