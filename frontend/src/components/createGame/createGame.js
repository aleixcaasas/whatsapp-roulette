import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import "./createGame.css";
import zipIcon from "../../assets/zipIcon.png"
import io from 'socket.io-client';

const socket = io('ws://localhost:4000');

const CreateGame = () => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");
	const location = useLocation();
	const [lobby, setLobbyUsers] = useState([]);
	const [gameId, setGameId] = useState("");

	const [veDeFora, setVeDeFora] = useState(true);

	useEffect(() => {
		if (location.search) {
			const params = new URLSearchParams(location.search);
			const nameParam = params.get('name');
			const adminParam = params.get('admin');
			const gameParam = params.get('gameId');
			setName(nameParam);
			setVeDeFora(adminParam === '1' ? false : true)
			setGameId(gameParam);
		}
	}, [location.search]);
	

	socket.on('epa', (data) => { 
		axios.post("http://localhost:4000/lobby", { gameId: data.gameId })
		.then((response) => {
			setLobbyUsers(response.data);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
	});

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
		zipInputClick_id.addEventListener('change', function () {
			fileChosen.textContent = this.files[0].name
			if (fileChosen.textContent.substr(fileChosen.textContent.length - 3) == "zip") {
				document.getElementById('uploadImage_id').src = zipIcon
			}
		});
	};
	const returnHome = () => {
		window.location.href = '/';
	}

	useEffect(() => {
		if (location.search) {
			const params = new URLSearchParams(location.search);
			const nameParam = params.get('name');
			const adminParam = params.get('admin');
			const gameParam = params.get('gameId');
			if (adminParam != '1') {
				console.log('hem entrat al useEffect lobby', gameParam)
				axios.post("http://localhost:4000/lobby", { gameId: gameParam })
					.then((response) => {
						console.log(response.data)
						setLobbyUsers(response.data);
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		}
	}, []);

	return (
		<div id="createGameContainer_id" class="createGameContainer">
			{!veDeFora ? (
				<div>
					<div id="createGameHeader_id" class="createGameHeader">
						<div id="usernameHeader_id" class="usernameHeader">{name}</div>
						<div>1/10</div>
					</div>
					<div className='divCreate'>
						<div className='titleCreateGame'>
							<div id="arrowContainer_id" class="arrowContainer"><FaArrowLeft size={25} class='arrowLeft' onClick={returnHome} /></div>
							<div id="createGameContainer_id" class="createGameContainer">
								<h1 className='create-game'>Create Game</h1>
								<form className='formCreate' onSubmit={sendForm}>
									<div id="zipForm_id" class="zipForm">
										<input type="file" class="zipInputClick" id="zipInputClick_id" onChange={(e) => setFile(e.target.files[0])} hidden />
										<label for="zipInputClick_id" id="zipInputClickButton_id" class="zipInputClickButton" onClick={changeFileName}>Upload zip file</label>
										<img src="" id="uploadImage_id" class="uploadImage"></img>
										<span id="fileChosen_id">No file chosen</span>
									</div>
									<button class="createButton" type="submit">CREATE</button>
								</form>
							</div>
							<div class="blankSpace"></div>
						</div>
					</div>
				</div>
			) : null}

			<div>
				{lobby.length > 0 ? (

					<div id="lobbyPlayersContainer_id" class="lobbyPlayersContainer">
						<div class="playersLobbyText">Players Lobby</div>
						<div class="inviteFriendsCodeContainer">
							<div class="inviteFriendsCode">Invitation code:</div>
							<div class="gameId">{gameId}</div>
						</div>
						{lobby.flat().map((player, index) => (
							<div className="playerStyleCSS" key={index}>
								[Player {index + 1}] <h1 className="h1Playertext">{player}</h1>
							</div>
						))}
						<button class="playButton" type="submit">PLAY GAME</button>
					</div>
				) : null}
			</div>
		</div>
	)
};

export default CreateGame;
