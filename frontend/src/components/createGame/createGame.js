import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import "./createGame.css";
import zipIcon from "../../assets/zipIcon.png"

const CreateGame = () => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");
	const location = useLocation();
	const [lobby, setLobbyUsers] = useState([]);
	const [gameId, setGameId] = useState("");	

	/*useEffect(() => {
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
	}, []);*/


	/*useEffect(() => {
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
	}, []);*/

	useEffect(() => {
        if(location.search) {
            const params = new URLSearchParams(location.search);
            const nameParam = params.get('name');
            setName(nameParam);
        }
    }, [location.search]);

	useEffect(() => {
		const par = new URLSearchParams(location.search);
		const namePar = par.get('name');
		document.getElementById('usernameHeader_id').innerHTML = "Username: " + namePar
	})

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

	const changeFileName = () => {
		const zipInputClick_id = document.getElementById('zipInputClick_id');
		const fileChosen = document.getElementById('fileChosen_id');
		zipInputClick_id.addEventListener('change', function(){
			fileChosen.textContent = this.files[0].name
			if(fileChosen.textContent.substr(fileChosen.textContent.length - 3) == "zip"){
				document.getElementById('uploadImage_id').src = zipIcon
			}
		});
	};
	const returnHome = () => {
		window.location.href = '/';
	}

	return (
		<div id="createGameContainer_id" class="createGameContainer">
			<div id="createGameHeader_id" class="createGameHeader">
				<div id="usernameHeader_id" class="usernameHeader"></div>
				<div>1/10</div>
			</div>
			<div className='divCreate'>
				<div className='titleCreateGame'>
					<div id="arrowContainer_id" class="arrowContainer"><FaArrowLeft size={25} class='arrowLeft' onClick={returnHome}/></div>
					<div id="createGameContainer_id" class="createGameContainer">
						<h1 className='create-game'>Create Game</h1>
						<form className='formCreate' onSubmit={sendForm}>
							<div id="zipForm_id" class="zipForm">
								<input type="file" class="zipInputClick" id="zipInputClick_id" onChange={(e) => setFile(e.target.files[0])} hidden/>
								<label for="zipInputClick_id" id="zipInputClickButton_id" class="zipInputClickButton" onClick={changeFileName}>Upload zip file</label>
								<img src="" id="uploadImage_id" class="uploadImage"></img>
								<span id="fileChosen_id">No file chosen</span>
							</div>
							<button class="createButton" type="submit">CREATE</button>
						</form>
					</div>
					{console.log("Lobby: ", lobby)}
					<div class="blankSpace"></div>
				</div>
			</div>
			<div>
				{lobby.length > 0 ? (
					
					<div id="lobbyPlayersContainer_id" class="lobbyPlayersContainer">
						<div class="playersLobbyText">Players Lobby</div>
						<div class="inviteFriendsCodeContainer">
							<div class="inviteFriendsCode">Invitation code:</div>
							<div class="gameId">{gameId}</div>
						</div>
						{lobby.map((player, index) => (
							<div class="playerStyleCSS" key={index}>[Player {index+1}] <h1 class="h1Playertext">{player}</h1></div>
						))}
						<button class="playButton" type="submit">PLAY GAME</button>
					</div>
				) : null}
			</div>
		</div>
    )
};

export default CreateGame;