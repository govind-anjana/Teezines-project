import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Basic from './Basic/Component/Basic'
import Login from './Pages/Login/Component/Login'
import UpdateProfile from './Pages/Profile/Component/Profile'

function App() {

  return (
    <>
    <Login/>
    <UpdateProfile/>
    <Basic/>
    </>
  )
}

export default App
