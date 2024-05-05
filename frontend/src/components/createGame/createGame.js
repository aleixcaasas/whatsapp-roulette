import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import "./createGame.css";
import zipIcon from "../../assets/zipIcon.png";

const CreateGame = () => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");
	const location = useLocation();
	const [lobby, setLobbyUsers] = useState([]);
	const [gameId, setGameId] = useState("");
	const [question, setQuestion] = useState(null);
	const [users, setUsers] = useState([]);

	/*useEffect(() => {
		// Establecer conexión WebSocket cuando se monta el componente
		const socket = new WebSocket("ws://localhost:4000");

		// Manejar evento de apertura de WebSocket
		socket.onopen = () => {
			console.log("WebSocket connected");
		};

		socket.onmessage = (event) => {
			console.log(event.data);
		};

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
		};

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
		if (location.search) {
			const params = new URLSearchParams(location.search);
			const nameParam = params.get("name");
			setName(nameParam);
		}
	}, [location.search]);

	useEffect(() => {
		const par = new URLSearchParams(location.search);
		const namePar = par.get("name");
		document.getElementById("usernameHeader_id").innerHTML =
			"Username: " + namePar;
	});

	const sendForm = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("zip", file);
		formData.append("username", name);

		axios
			.post("http://localhost:4000/create-game/", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => {
				setGameId(response.data.gameId);
				//fem peticio per saber la gent que hi ha a a lobby
				axios
					.post("http://localhost:4000/lobby", {
						gameId: response.data.gameId,
					})
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
		const zipInputClick_id = document.getElementById("zipInputClick_id");
		const fileChosen = document.getElementById("fileChosen_id");
		zipInputClick_id.addEventListener("change", function () {
			fileChosen.textContent = this.files[0].name;
			if (
				fileChosen.textContent.substr(
					fileChosen.textContent.length - 3
				) == "zip"
			) {
				document.getElementById("uploadImage_id").src = zipIcon;
			}
		});
	};

	const nextRound = () => {
		axios
			.get(`http://localhost:4000/new-round?gameId=${gameId}`)
			.then((response) => {
				/*if (
					response.headers["content-type"].startsWith(
						"application/octet-stream"
					)
				) {
					const imageUrl = window.URL.createObjectURL(response.data);
					const imgElement = document.createElement("img");
					imgElement.src = imageUrl;
					const imageContainer =
						document.getElementById("image-container");
					imageContainer.appendChild(imgElement);
				} else if (
					response.headers["content-type"].startsWith("audio")
				) {
					const audioUrl = window.URL.createObjectURL(response.data);
					const audioElement = document.createElement("audio");
					Element.src = audioUrl;
					audioElement.controls = true;
					const audioContainer =
						document.getElementById("audio-container");
					audioContainer.appendChild(audioElement);
					audioElement.play();
				} else {*/
				setQuestion(response.data.message);
			});
	};

	const returnHome = () => {
		window.location.href = "/";
	};

	const startGame = () => {
		axios
			.post("http://localhost:4000/start-game", { gameId: gameId })
			.then((response) => {
				if (response.data.ok === true) {
					setUsers(response.data.users);
					axios
						.get(`http://localhost:4000/new-round?gameId=${gameId}`)
						.then((response) => {
							if (
								response.headers["content-type"].startsWith(
									"application/octet-stream"
								)
							) {
								const imageUrl = window.URL.createObjectURL(
									response.data
								);
								const imgElement =
									document.createElement("img");
								imgElement.src = imageUrl;
								const imageContainer =
									document.getElementById("image-container");
								imageContainer.appendChild(imgElement);
							} else if (
								response.headers["content-type"].startsWith(
									"audio"
								)
							) {
								const audioUrl = window.URL.createObjectURL(
									response.data
								);
								const audioElement =
									document.createElement("audio");
								audioElement.src = audioUrl;
								audioElement.controls = true;
								const audioContainer =
									document.getElementById("audio-container");
								audioContainer.appendChild(audioElement);
								audioElement.play();
							} else {
								setQuestion(response.data.message);
							}
						});
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const submitVote = (user) => {
		console.log("Voting for: ", user);
		axios
			.post(
				"http://localhost:4000/vote",
				{
					gameId: gameId,
					player: name,
					vote: user,
				},
				{ headers: { "Content-Type": "application/json" } }
			)
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	return (
		<div id="createGameContainer_id" class="createGameContainer">
			<div id="createGameHeader_id" class="createGameHeader">
				<div id="usernameHeader_id" class="usernameHeader"></div>
				<div>1/10</div>
			</div>
			<div className="divCreate">
				<div className="titleCreateGame">
					<div id="arrowContainer_id" class="arrowContainer">
						<FaArrowLeft
							size={25}
							class="arrowLeft"
							onClick={returnHome}
						/>
					</div>
					<div
						id="createGameContainer_id"
						class="createGameContainer"
					>
						<h1 className="create-game">Create Game</h1>
						<form className="formCreate" onSubmit={sendForm}>
							<div id="zipForm_id" class="zipForm">
								<input
									type="file"
									class="zipInputClick"
									id="zipInputClick_id"
									onChange={(e) => setFile(e.target.files[0])}
									hidden
								/>
								<label
									for="zipInputClick_id"
									id="zipInputClickButton_id"
									class="zipInputClickButton"
									onClick={changeFileName}
								>
									Upload zip file
								</label>
								<img
									src=""
									id="uploadImage_id"
									class="uploadImage"
								></img>
								<span id="fileChosen_id">No file chosen</span>
							</div>
							<button class="createButton" type="submit">
								CREATE
							</button>
						</form>
					</div>
					{console.log("Lobby: ", lobby)}
					<div class="blankSpace"></div>
				</div>
			</div>
			<div>
				{lobby.length > 0 ? (
					<div
						id="lobbyPlayersContainer_id"
						class="lobbyPlayersContainer"
					>
						<div class="playersLobbyText">Players Lobby</div>
						<div class="inviteFriendsCodeContainer">
							<div class="inviteFriendsCode">
								Invitation code:
							</div>
							<div class="gameId">{gameId}</div>
						</div>
						{lobby.map((player, index) => (
							<div class="playerStyleCSS" key={index}>
								[Player {index + 1}]{" "}
								<h1 class="h1Playertext">{player}</h1>
							</div>
						))}
						<button class="playButton" onClick={startGame}>
							PLAY GAME
						</button>
					</div>
				) : null}
			</div>
			<div>
				{question ? <h1>Mensaje: {question.content}</h1> : null}
				{users
					? users.map((user, index) => (
							<button onClick={() => submitVote(user)} key={index}>
								{user}
							</button>
					  ))
					: null}
				<div id="image-container"></div>
				<button onClick={nextRound}>Next Round</button>
			</div>
		</div>
	);
};

export default CreateGame;
