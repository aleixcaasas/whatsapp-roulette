import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import CreateGame from './components/createGame/createGame';

function Routers(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<Home/>} />
        <Route path="/createGame" element={<CreateGame/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routers;