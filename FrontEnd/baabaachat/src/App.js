import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import CreateAccount from "./CreateAccount/CreateAccount";
import LandingPage from "./LandingPage";
import io from "socket.io-client";
function App() {
  const socket = io.connect(process.env.REACT_APP_IP);
  socket.io.on("reconnect_error", (error) => {
    socket.disconnect();
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home socket={socket} />}></Route>
        <Route path="/createAccount" element={<CreateAccount />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/welcomeToBaaBaaChat" element={<LandingPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
