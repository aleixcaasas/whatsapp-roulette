import {React} from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
    const [data, setData] = useState(null);
    const navigation = useNavigate();

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    const createGame = () => {
        navigation('/createGame');
    }

    return (
        <div>
            {console.log('Home')}
            <h1>HOME</h1>
            <button onClick={createGame}>Create Game</button>
        </div>
    )
}

export default Home