const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const uploadFile = (req, res) => {
    // Verificar si se ha cargado un archivo correctamente
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    
    
    // Aquí puedes manejar el archivo como desees
    // Por ejemplo, puedes acceder a él a través de req.file.buffer
    // Y luego realizar acciones como guardar el archivo en el disco, etc.
    
    // En este ejemplo, simplemente responderemos con un mensaje de éxito
    res.status(200).json({ message: 'File uploaded successfully' });
};

router.post("/upload", upload.single("zip"), uploadFile)

module.exports = router;
