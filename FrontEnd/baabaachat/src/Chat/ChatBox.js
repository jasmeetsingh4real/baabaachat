import React from "react";
import "./ChatBox.css";
import "../App.css";
export default function chatBox(props) {
  return (
    <>
      <div
        className={`${props.hide ? "" : "hide hide_chat"} ${
          props.hideChat ? " hide_chat " : ""
        } chat_box chat_container `}
      >
        <div className="reciever_name">
          <div
            className="back_button"
            onClick={() => {
              props.setHide(false);
              clearInterval(props.intervalId);
              localStorage.removeItem("reciever_name");
              localStorage.removeItem("reciever_id");
              props.setMessages([]);
              props.setHideChat(true);
              props.setSearchedUser({});
            }}
          >
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/eva-icon-fill/arrow-back-8.png"
              alt=""
            />
          </div>
          <div className="user_image_cont">
            <img
              src="https://i1.sndcdn.com/avatars-u5bWRU0JyyM3h0Qd-NdZ05A-t500x500.jpg"
              alt=""
            />
          </div>
          <div className="r_name">
            {localStorage.getItem("reciever_name") ||
              "select user to chat with"}
          </div>
        </div>
        <div className="chat_box_chat">
          <div className="chats">
            {props.messages.map((message) => {
              if (message.user === localStorage.getItem("_id")) {
                return (
                  <div key={message._id} className="sender_chat ">
                    <span className="message reciever">{message.message}</span>
                  </div>
                );
              } else
                return (
                  <div key={message._id} className="reciever_chat ">
                    <span className="message sender">{message.message}</span>
                  </div>
                );
            })}
          </div>
        </div>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            props.sendMessage();
          }}
        >
          <div className="mssg_input">
            <div className="mssg_input_box">
              <input
                placeholder={`send message as ${localStorage.getItem(
                  "userName"
                )}`}
                type="text"
                onChange={(e) => {
                  props.setMessage(e.target.value);
                }}
                value={props.message}
              />
            </div>
            <div>
              <button className="btn btn-success" type="submit">
                send
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
