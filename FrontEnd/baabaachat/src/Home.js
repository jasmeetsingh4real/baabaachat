import React from "react";
import { useEffect, useRef, useState, useTimeout } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "./Chat/ChatBox";
import "./App.css";
import "./Home.css";
import axios from "axios";
import moment from "moment";
export default function Home(props) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFiltersUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState();
  const searchUserRef = useRef("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const [chatBoxId, setChatBoxId] = useState("");
  // const [recieverName, setReieverName] = useState("");
  const [hide, setHide] = useState(false);
  const [hideChat, setHideChat] = useState(true);
  const [friends, setFriends] = useState([]);
  const [loadOld, setLoadOld] = useState(false);
  const navigate = useNavigate();
  const ip = process.env.REACT_APP_IP;
  const messagesEndRef = useRef(null);
  useEffect(() => {
    props.socket.on("recieve_message", (data) => {
      setLoadOld(false);
      getMessages();
    });
  }, [props.socket]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // console.log(moment(firstMessageDate).format("lll"));
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
  useEffect(() => {
    getMessages();
    if (!localStorage.getItem("reciever_name")) {
    }
  }, [hide, hideChat]);
  const getFriends = async () => {
    try {
      const res = await axios.get(`${ip}/api/user/getFriends`, {
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
  const getMessages = async (
    messageData = {
      reciever_id: localStorage.getItem("reciever_id"),
      firstMessageDate: undefined,
    }
  ) => {
    const res = await axios.get(`${ip}/api/user/getMessages`, {
      params: {
        users: [messageData.reciever_id, localStorage.getItem("_id")],
        firstMessageDate: messageData.firstMessageDate,
      },
    });
    if (res?.status === 200) {
      if (!loadOld) setMessages(res.data.chat);
      else setMessages(res.data.chat);
    }
  };
  const getUsers = async () => {
    const users = await axios.get(`${ip}/api/user/getUsers`);
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
    setLoadOld(false);
    const messageObj = {
      users: [localStorage.getItem("_id"), localStorage.getItem("reciever_id")],
      chat: {
        user: localStorage.getItem("_id"),
        message,
        createdAt: Date(),
      },
    };
    const res = await axios.post(`${ip}/api/user/sendMessage`, messageObj);
    if (res.status === 200) {
      getMessages();
      console.log("by res");
      setMessage("");
      props.socket.emit("send_message", { messageObj, chatBoxId });
    }
  };
  //join room
  const getChatBoxId = async (reciever_id) => {
    const res = await axios.get(`${ip}/api/user/getChatBoxId`, {
      params: {
        users: [reciever_id, localStorage.getItem("_id")],
      },
    });

    if (res?.status === 200) {
      if (res?.data?.chatBoxId) {
        setChatBoxId(res?.data?.chatBoxId);
        props.socket.emit("join_chatBox", res?.data?.chatBoxId);
      }
    }
  };
  const scrollToBottom = () => {
    if (!loadOld)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    else messagesEndRef.current?.scrollIntoView({ block: "end" });
  };
  const getOldMessages = () => {
    setLoadOld(true);
    if (messages.length > 0) {
      console.log(messages[messages.length - 1].createdAt);
      getMessages({
        reciever_id: localStorage.getItem("reciever_id"),
        firstMessageDate: messages[messages.length - 1].createdAt,
      });
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
                    getChatBoxId(user._id);
                    getMessages({ reciever_id: user._id });
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
                getChatBoxId(friend._id);
                localStorage.setItem("reciever_name", friend.name);
                localStorage.setItem("reciever_id", friend._id);
                getMessages({ reciever_id: friend._id });
                setSearchedUser({});
                setFiltersUsers([]);
              }}
            >
              {friend.name}
            </div>
          ))}
        </div>
        <ChatBox
          getOldMessages={getOldMessages}
          socket={props.socket}
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
          messagesEndRef={messagesEndRef}
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
