import React, { useState, useEffect } from "react";
import "./mainMenu.css";
import "../../fonts/DMSans-Bold.ttf";
import "../../fonts/DMSans-Medium.ttf";
import "../../fonts/DMSans-Regular.ttf";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import io from 'socket.io-client';

const socket = io('ws://localhost:4000');

function MainMenu() {
    const [codi, setCodi] = useState(null);
    const [name, setName] = useState("");
    const navigation = useNavigate();

    const createGame = () => {
        if (name === "") return;
        navigation(`/createGame?name=${name}&admin=1`);
    };

    const joinGame = (event) => {
        event.preventDefault();
        if (codi === "" || name === "" || !socket) return;
        socket.emit('join-game', { gameId: codi, username: name });
        axios.post(
            "http://localhost:4000/join-game",
            { gameId: codi, username: name },
            {
                headers: { "Content-Type": "application/json" },
            }
        ).then(navigation(`/createGame?name=${name}&gameId=${codi}`));
    };

    return (
        <>
            <div id="title_id" className="title">
                Welcome to WhatsApp Roulette
            </div>
            <div id="byNames_id" className="byNames">
                By Aleix Eric Isaac & Arnau
            </div>
            <form
                onSubmit={joinGame}
                id="formContainer_id"
                className="formContainer"
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
                        className="codeJoin2"
                        placeholder="Insert game code"
                        onChange={(e) => setCodi(e.target.value)}
                        required
                    ></input>
                    <button type="submit" id="buttonJoin_id" className="buttonJoin">
                        JOIN PARTY
                    </button>
                </div>
                <div style={{ marginTop: "15px", marginLeft: "" }}>
                    <button
                        id="buttonCreateGame_id"
                        className="buttonJoin2"
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
