import React, { useState } from "react";
import "./ChatBox.css";
import "../App.css";
import moment from "moment";
export default function ChatBox(props) {
  const disconnectSocket = () => {
    props.socket.emit("disconnectsocket", {});
    props.socket.disconnect();
    console.log("hello");
  };
  return (
    <>
      <div
        className={`${props.hide ? "" : "hide hide_chat"} ${
          props.hideChat ? " hide_chat " : ""
        } chat_box chat_container `}
      >
        <div className="chat-header">
          <div className="reciever_name">
            <div
              className="back_button"
              onClick={() => {
                props.setHide(false);
                localStorage.removeItem("reciever_name");
                localStorage.removeItem("reciever_id");
                props.setMessages([]);
                props.setHideChat(true);
                props.setSearchedUser({});
                disconnectSocket();
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
          </div>{" "}
          <div className=" text-end">
            {/* <button className="btn btn-sm btn-outline-primary ">
              Scroll up
            </button> */}
          </div>
        </div>
        <div className="chat_box_chat">
          <div className="text-center py-1">
            <button
              className="badge btn btn-primary"
              onClick={props.getOldMessages}
            >
              load more...
            </button>
          </div>
          <div className="chats">
            {props?.messages &&
              props?.messages.map((message, ID) => {
                let messageClass = "";
                const currentDate = moment();
                let old;

                if (moment(message.createdAt) < currentDate.startOf("day")) {
                  old = true;
                }

                messageClass = old
                  ? "message reciever bg-secondary border text-white shadow"
                  : "message reciever bg-primary border text-white shadow";
                if (message.user === localStorage.getItem("_id")) {
                  return (
                    <div key={ID} className="sender_chat ">
                      <span className={messageClass}>
                        <span>{message.message} </span>
                        <span className="chat-time ps-1">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>{" "}
                      </span>{" "}
                      <br />
                      {old && (
                        <span className="small me-2">
                          {new Date(message.createdAt).toDateString()}
                        </span>
                      )}
                    </div>
                  );
                } else
                  messageClass = old
                    ? "message sender bg-secondary border text-white shadow"
                    : "message sender bg-white border  shadow";
                return (
                  <div key={ID} className="reciever_chat ">
                    <span className={messageClass}>
                      <span>{message.message} </span>
                      <span className="chat-time ps-1">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>{" "}
                    </span>
                    <br />
                    {old && (
                      <span className="small ms-2">
                        {new Date(message.createdAt).toDateString()}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
          <div ref={props.messagesEndRef} />
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
