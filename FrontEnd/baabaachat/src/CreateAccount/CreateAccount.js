import React from "react";
import axios from "axios";
import "./CreateAccount.css";
import "../Login/Login.css";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
export default function CreateAccount() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const ip = process.env.REACT_APP_IP;
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if (error) setError(false);
      setErrorMessage("");
    }, 2000);
  }, [error, errorMessage]);
  const addUser = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${ip}/addUser`, {
        name: userName,
      });
      if (res.status === 200) {
        console.log(res);
        setError(false);
        setUserName("");
        setErrorMessage(`$User Added (${res?.data?.savedUser?.name})`);
      } else {
        setError(true);
        setErrorMessage("");
        setErrorMessage(res.response.data);
        alert("something went wrong");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data || "Something went wrong");
    }
  };
  return (
    <div className="page_body">
      <div className="page_actions_container login_page create_account">
        {error && (
          <i className="animateFromTop text-danger">
            {errorMessage || `Something went wrong`}!
          </i>
        )}
        {errorMessage[0] === "$" && (
          <i className="text-success animateFromTop">{errorMessage.slice(1)}</i>
        )}

        <div className="sheep_dp_container">
          <div className="dp_shadow_box"> </div>
          <img
            className={`sheep_image ${isPageLoaded ? "comeCloser" : ""}`}
            src="https://ik.imagekit.io/oukxwtbol/chatAppImages/sheep-with-camera-white-background-3d-rendering_1057-25733%20(1).jpeg?updatedAt=1697569785872"
            alt=""
          />
        </div>
        <div className="d-flex justify-content-center flex-column align-items-center">
          <div className="d-flex flex-column align-items-center">
            <form onSubmit={addUser}>
              <div
                className={`signup_form_container mb-2 ${
                  isPageLoaded ? "animateSignUpFromTop" : ""
                }`}
              >
                <div className="signup_input_cont">
                  <input
                    value={userName || ""}
                    placeholder="Create A Username"
                    type="text"
                    className=""
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div
                className={`signup_btn ${
                  isPageLoaded ? "animateSignUpBtnFromTop" : ""
                }`}
              >
                <button className="" type="submit">
                  Sign up
                </button>
              </div>
            </form>
            <i className="baabaainfo mt-3 mb-2 mx-4">
              Join the sheep community!
            </i>
            <NavLink className="link" to="/login">
              login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
