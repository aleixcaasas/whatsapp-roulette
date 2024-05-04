import {React} from 'react'
import { useState, useEffect } from 'react'
import MainMenu from './mainMenu'

function Home() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);
    return (
        <>
            {console.log('Home')}
            <MainMenu/>
        </>
    )
}

export default Home