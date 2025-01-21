import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/lobby" element={<Lobby />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
