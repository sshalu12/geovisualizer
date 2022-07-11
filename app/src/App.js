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
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/confirm_email/*" element={<ConfirmEmail />}></Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/locations" element={<Location />} />
          <Route path="/state" element={<State />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
