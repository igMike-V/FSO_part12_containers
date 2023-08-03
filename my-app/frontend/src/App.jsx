import Authors from './components/Authors.jsx'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend.jsx'
import './App.css'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/')
  }


  if (!token) {
    return (
      <>
        <LoginForm setToken={setToken} />
      </>
    )
  }
  

  return (
    <div className='App'>
      <nav className='nav'>
        <Link className='nav--link' to="/authors" >authors</Link>
        <Link className='nav--link' to="/books" >books</Link>
        <Link className='nav--link' to="/add" >add</Link>
        <Link className='nav--link' to="/recommend" >recommend</Link>
        <Link className='nav--link' to="/" onClick={logout} >logout</Link>
      </nav>
      <Routes>
        <Route path="/" exact element={<Navigate to="/authors" />} />
        <Route path="/authors" element={<Authors />} >Authors</Route>
        <Route path="/books" element={<Books client={client} />} >Books</Route>
        <Route path="/add" element={<NewBook />} >Add</Route>
        <Route path="/recommend" element={<Recommend />} >Add</Route>
      </Routes>
    </div>
  )
}

export default App