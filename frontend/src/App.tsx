import { useEffect, useState } from 'react';
import Profile from './Profile'
import './App.css'
import Loading from './Loading'

function App() {
  const [show, setShow] = useState(0)

  return (
    <>
      <Profile/>
      {/* <Loading/> */}
    </>
  )
}

export default App
