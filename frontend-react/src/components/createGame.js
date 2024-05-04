import React, { useState } from "react";
import axios from "axios";

const CreateGame = () => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");

	const sendForm = (event) => {
		event.preventDefault(); // Evitar que el formulario se envíe automáticamente

		const formData = new FormData(); // Crear un objeto FormData para enviar datos de formulario y archivos

		formData.append("zip", file); // Agregar el archivo al formulario
		formData.append("username", name); // Agregar el nombre de usuario al formulario

		axios
			.post("http://localhost:4000/create-game/", formData, {
				headers: { "Content-Type": "multipart/form-data" }, // Establecer el encabezado Content-Type adecuado para archivos
			})
			.then((response) => {
				console.log("Success:", response);
				// Handle success, maybe show a success message or redirect
			})
			.catch((error) => {
				console.error("Error:", error);
				// Handle error, maybe show an error message to the user
			});
	};

	return (
		<div>
			<h1>Create Game</h1>
			<form onSubmit={sendForm}>
				<input
					type="file"
					onChange={(e) => setFile(e.target.files[0])}
				/>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button type="submit">Create Game</button>
			</form>
		</div>
	);
};

export default CreateGame;
