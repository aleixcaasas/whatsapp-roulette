import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import {useLocation} from 'react-router-dom';

import "./createGame.css";

const CreateGame = (props) => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");
	const location = useLocation();


	useEffect(() => {
		// Establecer conexión WebSocket cuando se monta el componente
		const socket = new WebSocket("ws://localhost:4000");

		// Manejar evento de apertura de WebSocket
		socket.onopen = () => {
			console.log("WebSocket connected");
		};

		socket.onmessage = (event) => {
			console.log(event.data);
		}

		// Manejar evento de cierre de WebSocket
		socket.onclose = () => {
			console.log("WebSocket disconnected");
		};

		// Limpieza al desmontar el componente
		return () => {
			socket.close(); // Cerrar la conexión WebSocket al desmontar el componente
		};
	}, []);


	useEffect(() => {
		// Establecer conexión WebSocket cuando se monta el componente
		const socket = new WebSocket("ws://localhost:4000");

		// Manejar evento de apertura de WebSocket
		socket.onopen = () => {
			console.log("WebSocket connected");
		};

		socket.onmessage = (event) => {
			console.log(event.data);
		}

		// Manejar evento de cierre de WebSocket
		socket.onclose = () => {
			console.log("WebSocket disconnected");
		};

		// Limpieza al desmontar el componente
		return () => {
			socket.close(); // Cerrar la conexión WebSocket al desmontar el componente
		};
	}, []);

	useEffect(() => {
        if(location.search) {
            const params = new URLSearchParams(location.search);
            const nameParam = params.get('name');
            setName(nameParam);
			console.log(nameParam);
        }
    }, [location.search]);

	const sendForm = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("zip", file);
		formData.append("username", props.name);

		axios
			.post("http://localhost:4000/create-game/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => {
				console.log("Success:", response);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	return (
		<div className="divCreate">
			<div className="titleCreateGame">
				<div id="arrowContainer_id" class="arrowContainer">
					<FaArrowLeft size={25} class="arrowLeft" />
				</div>

				<div id="createGameContainer_id" class="createGameContainer">
					<h1 className="create-game">Create Game</h1>
					<form className="formCreate" onSubmit={sendForm}>
						<div id="zipForm_id" class="zipForm">
							<input
								type="file"
								onChange={(e) => setFile(e.target.files[0])}
							/>
							<label>
								<h3>Zip File</h3>
							</label>
						</div>

						<label>
							<h3>Username</h3>
						</label>
						<input
							className="button-56"
							type="text"
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<button className="button-55" type="submit">
							Create Game
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateGame;
