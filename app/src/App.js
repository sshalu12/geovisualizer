import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import State from "./state";
import Location from "./poi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Location />} />
        <Route exact path="/locations" element={<Location />} />
        <Route exact path="/state" element={<State />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
