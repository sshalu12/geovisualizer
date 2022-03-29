import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import State from "./state";
import Poi from "./poi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/" element={<Poi />} />
        <Route exact path="/poi" element={<Poi />} />
        <Route exact path="/state" element={<State />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
