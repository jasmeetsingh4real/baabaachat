import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import CreateAccount from "./CreateAccount/CreateAccount";
import LandingPage from "./LandingPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/createAccount" element={<CreateAccount />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/welcomeToBaaBaaChat" element={<LandingPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
