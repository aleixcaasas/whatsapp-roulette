const express = require("express");
const router = express.Router();
const uploadFile = require("../controllers/upload.controller");
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() });


router.post("/upload", upload.single("zip"), uploadFile);

module.exports = router;
