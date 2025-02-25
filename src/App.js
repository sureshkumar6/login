import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login.js";
import SignUp from "./Components/SignUp.js";
import PrivateComponent from "./Components/PrivateComponent.js";
import Timelogger from "./Components/Timelogger.js";
import Salary from "./Components/Salary.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <div className="App my-bg">
      <BrowserRouter>
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<Timelogger />} />
            <Route path="/salary" element={<Salary />} />
          </Route>

          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
