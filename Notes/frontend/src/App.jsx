import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import { getCurrentUser } from './services/api'
export const serverUrl = "http://localhost:4000"

function App() {
 
 useEffect(() => {
  const token = localStorage.getItem("token")
  if (token) getCurrentUser()
}, [])
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
    </Routes>
    </>
  )
}

export default App
