import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import PrivateRoute from "./api/PrivateRoute";
import { AuthProvider } from "./api/authentication";
import StartGame from "./pages/StartGame";
import GameBoard from "./pages/GameBoard";
import History from "./pages/History";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/lobby" element={<PrivateRoute component={Lobby} />} />
          <Route path="/home" element={<PrivateRoute component={Home} />} />
          <Route path="/history" element={<PrivateRoute component={History} />} />
          <Route path="/start-game" element={<PrivateRoute component={StartGame} />} />
          <Route path="/game-board/:id" element={<GameBoard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
