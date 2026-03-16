import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
export const serverUrl = "http://localhost:4000"

function App() {

  const dispatch = useDispatch()
 
 useEffect(() => {
  const token = localStorage.getItem("token")
  if (token) getCurrentUser(dispatch)
}, [dispatch])

const {userData} = useSelector((state)=>state.user)
console.log(userData)
  return (
    <>
    <Routes>
      <Route path='/' element={userData?<Home/>: <Navigate to="/auth/" replace/>}/>
      <Route path='/auth' element={userData ? <Navigate to="/" replace/> :<Auth/>}/>
    </Routes>
    </>
  )
}

export default App
