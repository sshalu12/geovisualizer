import { BrowserRouter, Routes, Route } from "react-router-dom";
import State from "./state";
import Location from "./poi";
import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./forgot_password";
import ConfirmEmail from "./confirm_email";
import ProtectedRoutes from "./ProtectedRoute";
import Logout from "./logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/forgotpassword" element={<ForgotPassword />} />
        <Route exact path="/confirm_email/*" element={<ConfirmEmail />}></Route>

        <Route element={<ProtectedRoutes />}>
          <Route exact path="/locations" element={<Location />} />
          <Route exact path="/state" element={<State />} />
          <Route exact path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
