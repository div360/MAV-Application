import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'
import './App.css'
import Loading from './pages/Loading'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer); // This will clear the timer when the component unmounts.
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter> {/* Wrap your app with the router */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/d" element={<Dashboard />} /> 
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer /> 
    </BrowserRouter>
  )
}

export default App;
