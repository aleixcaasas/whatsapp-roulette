import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import "./createGame.css";

const CreateGame = (props) => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");
	const location = useLocation();
	const [lobby, setLobbyUsers] = useState([]);
	const [gameId, setGameId] = useState("");

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
        }
    }, [location.search]);

	const sendForm = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("zip", file);
		formData.append("username", name);

		axios.post("http://localhost:4000/create-game/", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => {
				setGameId(response.data.gameId);
				//fem peticio per saber la gent que hi ha a a lobby
				axios.post("http://localhost:4000/lobby", { gameId: response.data.gameId })
					.then((response) => {
						setLobbyUsers(response.data);
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			})
			.catch((error) => {
				console.error("Error:", error);
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
								<input type="file" class="zipInputClick" id="zipInputClick_id" onChange={(e) => setFile(e.target.files[0])} hidden required/>
								<label for="zipInputClick_id" id="zipInputClickButton_id" class="zipInputClickButton">Upload zip file</label>
							</div>
							<button class="playButton" type="submit">PLAY</button>
						</form>
					</div>
				</div>
			</div>
			<div>
				{lobby ? (
					<div>
						<h2>Players in lobby</h2>
						<ul>
							{lobby.map((player, index) => (
								<li key={index}>{player}</li>
							))}
						</ul>
					</div>
				) : null}
			</div>
		</div>
    )
};

export default CreateGame;
