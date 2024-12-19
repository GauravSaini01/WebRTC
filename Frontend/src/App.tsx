import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { Sender } from './Pages/Sender'
import { Reciever } from './Pages/Reciever'

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/sender" element={<Sender/>}></Route>
         <Route path="/reciever" element={<Reciever/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
