import React from "react";
import { useEffect, useRef, useState, useTimeout } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "./Chat/ChatBox";
import "./App.css";
import "./Home.css";
import axios from "axios";
export default function Home() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFiltersUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState();
  const searchUserRef = useRef("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  // const [recieverName, setReieverName] = useState("");
  const [hide, setHide] = useState(false);
  const [hideChat, setHideChat] = useState(true);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const ip = process.env.REACT_APP_IP;
  useEffect(() => {
    if (!localStorage.getItem("LoggedIn")) {
      navigate("/welcomeToBaaBaaChat");
      return;
    }
    localStorage.removeItem("reciever_id");
    localStorage.removeItem("reciever_name");
    getFriends();
    getUsers();
  }, []);
  let intervalId = null;
  useEffect(() => {
    // getMessages();
    intervalId = setInterval(() => {
      if (
        !localStorage.getItem("LoggedIn") ||
        !localStorage.getItem("reciever_name")
      ) {
        return;
      }
      getMessages();
    }, 3000);
    if (!localStorage.getItem("reciever_name")) {
      clearInterval(intervalId);
    }
  }, [hide, hideChat]);
  const getFriends = async () => {
    try {
      const res = await axios.get(`${ip}/getFriends`, {
        params: {
          id: localStorage.getItem("_id"),
        },
      });
      if (res?.status === 200) {
        setFriends(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(friends);
  const getMessages = async () => {
    // if (!localStorage.getItem("reciever_id")) {
    //   return;
    // }
    const res = await axios.get(`${ip}/getMessages`, {
      params: {
        users: [
          localStorage.getItem("reciever_id"),
          localStorage.getItem("_id"),
        ],
      },
    });
    if (res?.status === 200) {
      setMessages(res.data.chat);
    }
  };
  // console.log(messages);
  const getUsers = async () => {
    const users = await axios.get(`${ip}/getUsers`);
    if (users.data.length) {
      setUsers(users.data);
    } else {
      console.log("users not found");
    }
  };

  const findUser = (e) => {
    setSearchedUser({ name: e.target.value });
    if (e.target.value) {
      setFiltersUsers(
        users.filter((user) => {
          if (user.name.toLowerCase().includes(e.target.value.toLowerCase())) {
            return true;
          } else return false;
        })
      );
    } else {
      setFiltersUsers([]);
    }
  };
  const sendMessage = async () => {
    if (!message || !localStorage.getItem("reciever_id")) {
      return;
    }
    const res = await axios.post(`${ip}/sendMessage`, {
      users: [localStorage.getItem("_id"), localStorage.getItem("reciever_id")],
      chat: {
        user: localStorage.getItem("_id"),
        message,
        createdAt: Date(),
      },
    });
    if (res.status === 200) {
      getMessages();
      setMessage("");
      getFriends();
    }
  };

  return (
    <div className="page_body">
      <div className="page_actions_container">
        <div className={`${hide ? "hide" : ""} messages_container`}>
          <div className="user_details">
            <div className="user_image_cont">
              <img
                src="https://ik.imagekit.io/oukxwtbol/chatAppImages/sheep-with-camera-white-background-3d-rendering_1057-25733%20(1).jpeg?updatedAt=1697569785872"
                alt=""
              />
            </div>
            <div className="user_name">
              <h4>{"@" + localStorage.getItem("userName") || "Username"}</h4>
            </div>
            <div className="user_actions">
              <button
                onClick={() => {
                  setShowLogout((old) => !old);
                }}
              >
                <img
                  className="menu_icon"
                  src="https://static.thenounproject.com/png/3237996-200.png"
                  alt=""
                />
              </button>
            </div>
          </div>
          {showLogout && (
            <button
              className="logout_button btn btn-sm ms-1  bg-white border shadow"
              onClick={() => {
                localStorage.removeItem("LoggedIn");
                localStorage.removeItem("_id");
                localStorage.removeItem("userName");
                navigate("/login");
              }}
            >
              Logout
            </button>
          )}
          <div className="search_user">
            <label htmlFor="">Search Username</label>
            <input
              type="text"
              onChange={findUser}
              ref={searchUserRef}
              value={searchedUser?.name || ""}
            />
          </div>
          {/*------------search result-------------- */}
          <div className="search_results">
            {filteredUsers
              .filter((f, i) => i < 5 && f._id !== localStorage.getItem("_id"))
              .map((user) => (
                <div
                  key={user._id}
                  className="search_item"
                  onClick={() => {
                    setHide(true);
                    setHideChat(false);
                    // setReieverName(user);
                    localStorage.setItem("reciever_name", user.name);
                    localStorage.setItem("reciever_id", user._id);
                    setSearchedUser({});
                    setFiltersUsers([]);
                  }}
                >
                  <div className="search_item_dp user_image_cont">
                    <img
                      src="https://i1.sndcdn.com/avatars-u5bWRU0JyyM3h0Qd-NdZ05A-t500x500.jpg"
                      alt=""
                    />
                  </div>
                  <div className="search_item_user">{user?.name}</div>
                </div>
              ))}
          </div>
          <h6 className="mx-3 mb-2 mt-3">Your Friends:</h6>
          {/*------------friends component-------------- */}
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="friend_item bg-white m-2 rounded px-3 py-2 border-bottom"
              onClick={() => {
                setHide(true);
                setHideChat(false);

                localStorage.setItem("reciever_name", friend.name);
                localStorage.setItem("reciever_id", friend._id);
                setSearchedUser({});
                setFiltersUsers([]);
              }}
            >
              {friend.name}
            </div>
          ))}
        </div>
        <ChatBox
          intervalId={intervalId}
          id={searchedUser?._id}
          setMessage={setMessage}
          sendMessage={sendMessage}
          messages={messages}
          getMessages={getMessages}
          message={message}
          hide={hide}
          setHide={setHide}
          setMessages={setMessages}
          setHideChat={setHideChat}
          setSearchedUser={setSearchedUser}
        />
        {hideChat && (
          <div className="h-100 w-100 d-flex align-items-center justify-content-center">
            <div>No chat selected</div>
          </div>
        )}
      </div>
    </div>
  );
}
