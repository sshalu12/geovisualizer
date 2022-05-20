import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import State from "./state";
import Location from "./poi";
import Login from "./login";
import Signup from "./signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/locations" element={<Location />} />
        <Route exact path="/state" element={<State />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
