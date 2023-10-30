import React, { useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const [loadContent, setLoadContent] = useState(false);
  useEffect(() => {
    setLoadContent(true);
  }, []);
  const navigate = useNavigate();

  return (
    <div className="page_body">
      <div className="page_actions_container">
        <div
          className={`bg_image_container ${loadContent ? "loadFromleft" : ""}`}
        >
          <div className="landing_heading">
            <h3 className="m-0">Baa Baa Chat</h3>
            <div className="landing_heading_actions text-dark m-0 rounded ">
              <p className="landing_heading_actions_p text-start m-0 pe-md-5 me-5 ">
                Welcome to BaaBaaChat! Let’s chat like sheeps do.
              </p>
              <button
                className="btn btn-warning mt-2 px-5 text-white shadow"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Proceed
              </button>
            </div>
          </div>
          <img
            src="https://ik.imagekit.io/oukxwtbol/chatAppImages/landing%20page.png?updatedAt=1697571647376"
            alt=""
          />
        </div>
        <div
          className={`landing_page_actions d-flex align-items-center  justify-content-center ${
            loadContent ? "loadFromRight" : ""
          }`}
        >
          <div className="text-center  bg-white p-4 rounded shadow">
            <p className="text-center">
              Welcome to BaaBaaChat! Let’s chat like sheeps do.
            </p>
            <button
              className="btn btn-warning text-white "
              onClick={() => {
                navigate("/login");
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
