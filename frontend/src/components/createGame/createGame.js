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
		<div id="createGameContainer_id" class="createGameContainer">
			<div id="createGameHeader_id" class="createGameHeader">
				<div>Username: </div>
				<div>0/10</div>
			</div>
			<div className='divCreate'>
				<div className='titleCreateGame'>
					<div id="arrowContainer_id" class="arrowContainer"><FaArrowLeft size={25} class='arrowLeft' /></div>
					
					<div id="createGameContainer_id" class="createGameContainer">
						<h1 className='create-game'>Create Game</h1>
						<form className='formCreate' onSubmit={sendForm}>
							<div id="zipForm_id" class="zipForm">
								<input type="file" class="zipInputClick" id="zipInputClick_id" onChange={(e) => setFile(e.target.files[0])} hidden/>
								<label for="zipInputClick_id" id="zipInputClickButton_id" class="zipInputClickButton">Upload zip file</label>
							</div>
						</form>
						<button class="inviteFriendsButton" type="submit">INVITE FRIENDS</button>
						<button class="playButton" type="submit">PLAY</button>
					</div>
				</div>
			</div>
		</div>
    )
};

export default CreateGame;
