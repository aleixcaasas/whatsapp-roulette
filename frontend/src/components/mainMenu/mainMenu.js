import { React } from "react";
import { useState, useEffect } from "react";
import "./mainMenu.css";
import "../../fonts/DMSans-Bold.ttf";
import "../../fonts/DMSans-Medium.ttf";
import "../../fonts/DMSans-Regular.ttf";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import io from 'socket.io-client';



function MainMenu() {
	const [codi, setCodi] = useState(null);
	const [name, setName] = useState("");
	const navigation = useNavigate();

	const socket = io('ws://localhost:4000');

	const createGame = () => {
		if (name === "") return;
		navigation(`/createGame?name=${name}`);
	};

	const joinGame = (event) => {
		event.preventDefault();

		console.log(codi, name);
		if (codi === "" || name === "") return;
		axios.post(
			"http://localhost:4000/join-game",
			{ gameId: codi, username: name },
			{
				headers: { "Content-Type": "application/json" },
			}
		);
	};

	return (
		<>
			<div id="title_id" class="title">
				Wellcome to WhatsApp Roulette
			</div>
			<div id="byNames_id" class="byNames">
				By Aleix Eric Isaac & Arnau
			</div>
			<form
				onSubmit={joinGame}
				id="formContainer_id"
				class="formContainer"
			>
				<input
					placeholder="Username"
					className="codeJoin"
					type="text"
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<div className="vox" style={{ marginTop: "15px" }}>
					<input
						id="codeJoin_id"
						class="codeJoin2"
						placeholder="Insert game code"
						onChange={(e) => setCodi(e.target.value)}
						required
					></input>
					<button type="submit" id="buttonJoin_id" class="buttonJoin">
						JOIN PARTY
					</button>
				</div>
				<div style={{ marginTop: "15px", marginLeft: "" }}>
					<button
						id="buttonCreateGame_id"
						class="buttonJoin2"
						onClick={createGame}
					>
						CREATE GAME
					</button>
				</div>
			</form>
		</>
	);
}

export default MainMenu;
