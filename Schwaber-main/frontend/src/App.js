import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-cyan/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';
import './App.css';
import axios from "axios";
import Login from './components/AUTH/Login';
import Calendar from './components/Calendar/Home';






function App() {
  const { REACT_APP_BACKEND, REACT_APP_PLANNER_API } = process.env;
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);



  useEffect(() => {
    axios.get(REACT_APP_PLANNER_API + '/auth/check', { withCredentials: true })
      .then(response => {
        setIsAuthenticated(response.data.authenticated);
        if (response.data.authenticated) {
          setUser(response.data.user);
        }

        const redirectTo = localStorage.getItem('redirectTo');
        if (response.data.authenticated && redirectTo) {
          localStorage.removeItem('redirectTo');
          window.location.href = redirectTo;
        }
      }).catch(error => { console.log(error) });
  }, [REACT_APP_BACKEND, setUser]);

  const PrivateRoute = ({ element }) => {
    if (isAuthenticated === null) {
      return <Login redirect={false} />;
    }
    if (!isAuthenticated) {
      localStorage.setItem('redirectTo', window.location.pathname + window.location.search);
      return <Navigate to="/login" />;
    }
    return element;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={<Calendar />} />} />
        </Routes>

      </Router>
    </>
  );
}

export default App;
