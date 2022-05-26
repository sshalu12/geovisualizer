import { BrowserRouter, Routes, Route } from "react-router-dom";
import State from "./state";
import Location from "./poi";
import Login from "./login";
import Signup from "./signup";
import ProtectedRoutes from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/" element={<Login />} />

        <Route exact path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/locations" element={<Location />} />
          <Route exact path="/state" element={<State />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
