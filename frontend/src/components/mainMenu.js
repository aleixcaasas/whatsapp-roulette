import {React} from 'react'
import { useState, useEffect } from 'react'
import './mainMenu/mainMenu.css'
import '../fonts/DMSans-Bold.ttf'
import '../fonts/DMSans-Medium.ttf'
import '../fonts/DMSans-Regular.ttf'
import { useNavigate } from 'react-router-dom';

function MainMenu(){
    const [data, setData] = useState(null);
    const navigation = useNavigate();

    const createGame = () => {
        navigation('/createGame');
    }

    return(
        <>
            <div id="title_id" class="title">Wellcome to WhatsApp Roulette</div>
            <div id="byNames_id" class="byNames">By Aleix Eric Isaac & Arnau</div>
            <div id="formContainer_id" class="formContainer">
                <input id="codeJoin_id" class="codeJoin" placeholder="Insert game code:"></input>
                <button id="buttonJoin_id" class="buttonJoin">JOIN PARTY</button>
            </div>
            <button id="buttonCreateGame_id" class="createGame" onClick={createGame}>CREATE GAME</button>
        </>
    )
}

export default MainMenu