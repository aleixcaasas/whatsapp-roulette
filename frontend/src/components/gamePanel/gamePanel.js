import { React } from "react";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "./gamePanel.css";
import "../../fonts/DMSans-Bold.ttf";
import "../../fonts/DMSans-Medium.ttf";
import "../../fonts/DMSans-Regular.ttf";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import io from 'socket.io-client';

function GamePanel(){
    const location = useLocation();

    useEffect(() => {
        const par = new URLSearchParams(location.search);
        const namePar = par.get('name');
        const codePar = par.get('code');
        document.getElementById('usernameHeader_id').innerHTML = "Username: " + namePar
        document.getElementById('codeHeader_id').innerHTML = "Lobby Code: " + codePar
    })

    return(
        <div id="gamePanelContainer_id" class="gamePanelContainer">
            <div id="gamePanelHeaderContainer_id" class="gamePanelHeaderContainer">
                <div id="usernameHeader_id" class="usernameHeader"></div>
                <div id="codeHeader_id" class="codeHeader"></div>
            </div>
            <div id="gamePanelBodyContainer_id" class="gamePanelBodyContainer">
                <div class="whoisthis">Who is this message from?</div>
                <div class="missatgeRandomWhatsapp">[10:44 3/2/22] - Guebardo 🥵🍑</div>
                <img src=""></img>
            </div>
            <div id="gamePanelBottomContainer_id" class="gamePanelBottomContainer">
                <div id="bottomRight_id" class="bottomRight">
                    <button>Gerardo</button>
                    <button>Robert</button>
                    <button>Gina</button>
                    <button>KikoR</button>
                </div>
                <div id="bottomLeft_id" class="bottomLeft">
                    <button>Yum</button>
                    <button>Houd</button>
                    <button>Jorj</button>
                    <button>Lold</button>
                </div>
            </div>
        </div>
    )
}

export default GamePanel;