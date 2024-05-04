import {React} from 'react'
import { useState, useEffect } from 'react'

function Home() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);
    return (
        <div>
            {console.log('Home')}
            <h1>HOME</h1>
        </div>
    )
}

export default Home