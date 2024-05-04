import { React } from 'react'
import { useState, useEffect } from 'react'
import './mainMenu.css'
import '../../fonts/DMSans-Bold.ttf'
import '../../fonts/DMSans-Medium.ttf'
import '../../fonts/DMSans-Regular.ttf'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MainMenu() {
    const [codi, setCodi] = useState(null);
    const [name, setName] = useState('');
    const navigation = useNavigate();

    const createGame = () => {
        navigation('/createGame');
    }

    const joinGame = () => {
        axios.post('http://localhost:3001/joinGame', { gameId: codi, username: name });
    }

    return (
        <>
            <div id="title_id" class="title">Wellcome to WhatsApp Roulette</div>
            <div id="byNames_id" class="byNames">By Aleix Eric Isaac & Arnau</div>
            <form onSubmit={joinGame} id="formContainer_id" class="formContainer">
                <div>
                    <input id="codeJoin_id" class="codeJoin" placeholder="Insert game code:" onChange={(e) => setCodi(e.target.value)}></input>
                    <button type="submit" id="buttonJoin_id" class="buttonJoin">JOIN PARTY</button>
                </div>
                <div>
                    <input placeholder='Username' className="codeJoin" type="text" onChange={(e) => setName(e.target.value)} required/>
                    <button id="buttonCreateGame_id" class="buttonJoin" onClick={createGame}>CREATE GAME</button>
                </div>
            </form>
        </>
    )
}

export default MainMenu