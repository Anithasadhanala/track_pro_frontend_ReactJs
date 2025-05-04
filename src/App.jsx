import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TaskBoard from './components/TaskBoard';
import './App.css';
import Login from './components/Login';
import { firebaseApp } from "./integrations/firebase/initialize";

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth(firebaseApp);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async(authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/taskboard" replace /> : <Login />} />
        <Route path="/taskboard" element={user ? <TaskBoard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
