import {React} from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";

import './createGame.css';

const CreateGame = () => { 
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');

    const sendForm = () => {
        axios.post('http://localhost:3000/create-game', { zip: file, username: name })
         .then(response => {
             console.log("Success:", response);
             // Handle success, maybe show a success message or redirect
         })
         .catch(error => {
             console.error("Error:", error);
             // Handle error, maybe show an error message to the user
         });
    }

    return (
        <div className='divCreate'>
            <div className='titleCreateGame'>
                <FaArrowLeft size={25} className='arrowleft' />
                <h1 className='create-game'>Create Game</h1>
            </div>
            <form className='formCreate' onSubmit={sendForm}>
                <label><h3>Zip File</h3></label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <label><h3>Username</h3></label>
                <input className="button-56" type="text" onChange={(e) => setName(e.target.value)} />
                <button className="button-55" type="submit">Create Game</button>
            </form>
        </div>
    )
}

export default CreateGame;