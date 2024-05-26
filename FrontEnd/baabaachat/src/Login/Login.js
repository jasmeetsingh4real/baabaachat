import React, { useEffect } from "react";
import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
export default function Login() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setIsPageLoaded(true);

    return () => {
      setIsPageLoaded(false);
    };
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if (error) setError(false);
    }, 2000);
  }, [error]);

  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const ip = process.env.REACT_APP_IP;

  const login = async (e) => {
    e.preventDefault();
    try {
      if (!username.trim()) {
        throw new Error("Please enter username");
      }
      const res = await axios.post(`${ip}/api/user/login`, {
        username,
      });
      if (res.status === 200) {
        setError(false);
        localStorage.setItem("LoggedIn", "true");
        localStorage.setItem("_id", `${res.data.user._id}`);
        localStorage.setItem("userName", `${res.data.user.name}`);
        navigate("/");
      }
    } catch (err) {
      setErrMsg(err?.response?.data || err.message || "Something went wrong");
      setError(true);
      console.log(err);
    }
  };
  return (
    <div className="page_body">
      <div className="page_actions_container login_page">
        {error && (
          <i className="animateFromTop text-danger">
            {errMsg || `Something went wrong`}!
          </i>
        )}
        <div className="sheep_dp_container">
          <div className="dp_shadow_box"> </div>
          <img
            className={`${isPageLoaded ? "comeFromRight" : ""}`}
            src="https://ik.imagekit.io/oukxwtbol/chatAppImages/sheep-with-camera-white-background-3d-rendering_1057-25733%20(1).jpeg?updatedAt=1697569785872"
            alt=""
          />
        </div>
        <div className="d-flex flex-column align-items-center">
          <form onSubmit={login}>
            <div
              className={`login_form_container ${
                isPageLoaded ? "animateFromTop" : ""
              }`}
            >
              <div className="login_input_cont">
                <input
                  placeholder="Login With Username"
                  type="text"
                  className=""
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div className="login_btn_cont login text-center ">
                <button className="" type="submit">
                  Login
                </button>
              </div>
            </div>
          </form>
          {/* <i className="baabaainfo mt-3 mb-2 mx-4">
            With BaaBaaChat, you can chat like a sheep and have a woolly good
            time! 🐑🐑🐑
          </i> */}
          <br />
          <NavLink className="link" to="/createAccount">
            Create Account
          </NavLink>
        </div>
      </div>
    </div>
  );
}
