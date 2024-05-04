import {React} from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';

const CreateGame = () => { 
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');

    const sendForm = () => {
        console.log(file, name);
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
        <div>
            <h1>Create Game</h1>
            <form onSubmit={sendForm()}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <input type="text" onChange={(e) => setName(e.target.value)} />
                <button type="submit">Create Game</button>
            </form>
        </div>
    )
}

export default CreateGame;