import { React } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

import "./createGame.css";

const CreateGame = (props) => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");

	const sendForm = (event) => {
		event.preventDefault(); // Evitar que el formulario se envíe automáticamente

		const formData = new FormData(); // Crear un objeto FormData para enviar datos de formulario y archivos

		formData.append("zip", file); // Agregar el archivo al formulario
		formData.append("username", props.name); // Agregar el nombre de usuario al formulario

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
        <div className='divCreate'>
            <div className='titleCreateGame'>
                <div><FaArrowLeft size={25} className='arrowleft' /></div>
                
                <div id="createGameContainer_id" class="createGameContainer">
                <h1 className='create-game'>Create Game</h1>
                <form className='formCreate' onSubmit={sendForm}>
                    <label><h3>Zip File</h3></label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <label><h3>Username</h3></label>
                    <input className="button-56" type="text" onChange={(e) => setName(e.target.value)} required />
                    <button className="button-55" type="submit">Create Game</button>
                </form>
            </div>
            </div>
        </div>
    )
};

export default CreateGame;
