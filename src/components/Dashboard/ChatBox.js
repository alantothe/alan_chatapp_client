import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectActiveConversation } from "../../features/activeConversationSlice";
import Avatar from "react-avatar";
import { sendMessage, fetchMessages, selectMessages } from "../../features/messagesSlice";
import { selectUser } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import socket from '../../socketConnect/socket'


function ChatBox() {
  const [inputMessage, setInputMessage] = useState("");
  const activeConversation = useSelector(selectActiveConversation);
  const user = useSelector(selectUser);
  const messages = useSelector(selectMessages);
  const dispatch = useDispatch();




  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  useEffect(() => {
    if (activeConversation && user) {
      dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));

      // Subscribe to the message event from the server
      socket.on("message", () => {
        dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));
      });
    }

    // Clean up the subscription on unmount
    return () => {
      socket.off("message");
    };
  }, [dispatch, activeConversation, user]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const messageData = {
        senderId: user.id,
        receiverId: activeConversation.friendData.id,
        content: inputMessage,
        senderData: {
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };

      await dispatch(sendMessage(messageData));
      setInputMessage("");

      // Emit sendMessage event to the server
      socket.emit("sendMessage", messageData);

      // Fetch messages after sending a message
      dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));
    }
  };




  return (
    <div className="bar ChatBox">
     <header>
  {activeConversation && activeConversation.friendData ? (
    <>
      <Avatar
        src={activeConversation.friendData.avatar}
        size="40"
        round={true}
        style={{ marginRight: "10px" }}
      />
      <h1>
        {activeConversation.friendData.firstName} {activeConversation.friendData.lastName}
      </h1>
    </>
  ) : (
    <h1>Please Click On a Friend To Start Chat</h1>
  )}
</header>


<div className="chat-history">
  {activeConversation ? (
    <div className="chat-messages">
      {/* Display chat messages here */}
      {messages.map((message, index) => (
  message.sender && (
    <div
      key={index}
      className={
        message.senderId === user.id ? "sent-message" : "received-message"
      }
    >
      <div className="message-avatar">
        <Avatar
          src={message.sender.avatar}
          size="30"
          round={true}
          style={{ marginRight: "5px" }}

        />
      </div>
      <div className="message-info">
        <p>
          {message.sender.firstName} {message.sender.lastName}
          <small className="date">{new Date(message.timestamp).toLocaleString()}</small>
        </p>
        <p className="message-content">{message.content}</p>

      </div>
    </div>
  )
))}


    </div>
  ) : (
    <div className="beginning-of-message-history">
      <h3>Please Click On a Friend To Start Chat</h3>
    </div>
        )}

      </div>
      <footer>
      <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message here"
            className="chat-input-field"
            value={inputMessage}
            onChange={handleInputChange}
          />
          <button onClick={handleSendMessage}>Send</button>

        </div>
      </footer>
    </div>
  );
}

export default ChatBox;
