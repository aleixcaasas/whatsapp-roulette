const AdmZip = require('adm-zip');

// Función para procesar el archivo ZIP
const processZipFile = (zipFilePath) => {
    // Crear una instancia de AdmZip con el archivo ZIP
    const zip = new AdmZip(zipFilePath);

    // Obtener todas las entradas del archivo ZIP
    const zipEntries = zip.getEntries();

    // Estructura de datos temporal para almacenar los mensajes
    const messages = [];

    // Iterar sobre cada entrada del archivo ZIP
    zipEntries.forEach((entry) => {
        // Verificar si la entrada es el archivo de mensajes "_chat.txt"
        if (entry.entryName === "_chat.txt") {
            // Leer el contenido del archivo
            const content = zip.readAsText(entry);
            // Dividir el contenido en líneas
            const lines = content.split("\n");
            // Iterar sobre cada línea para procesar los mensajes
            lines.forEach((line) => {
                // Analizar la línea para extraer la información del mensaje
                const match = /\[(.*?)\] (.*?): ‎(.*)/.exec(line);
                if (match) {
                    // Crear un objeto con la información del mensaje y guardarlo en la estructura de datos temporal
                    const message = {
                        timestamp: match[1],
                        sender: match[2],
                        content: match[3]
                    };
                    messages.push(message);
                }
            });
        }
    });

    // Devolver la estructura de datos temporal con los mensajes procesados
    return messages;
};

// Ruta del archivo ZIP
const zipFilePath = "ruta/del/archivo.zip";

// Procesar el archivo ZIP y obtener los mensajes
const messages = processZipFile(zipFilePath);

// Mostrar los mensajes procesados
console.log(messages);
