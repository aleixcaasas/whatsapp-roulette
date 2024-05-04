import {React} from 'react'
import { useState, useEffect } from 'react'
import MainMenu from './mainMenu'
import { useNavigate } from 'react-router-dom';

function Home() {
    const [data, setData] = useState(null);
    const navigation = useNavigate();

    const createGame = () => {
        navigation('/createGame');
    }
    return (
        <>
            {console.log('Home')}
            <MainMenu/>
        </>
    )
}

export default Home