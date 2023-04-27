import React, { useState } from "react";
import "./dashboard.css";
import Avatar from "react-avatar";

function ChatBox({ selectedFriend, sendMessage }) {
  const [inputMessage, setInputMessage] = useState("");

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="bar ChatBox">
      <header>
        {selectedFriend ? (
          <>
            <div>
              <Avatar
                size={50}
                round
                src={selectedFriend.avatar}
                alt={`${selectedFriend.firstName} ${selectedFriend.lastName}`}
              />
            </div>
            <div>
              <h1 className="white-text">
                {selectedFriend.firstName} {selectedFriend.lastName}
              </h1>
            </div>
          </>
        ) : (
          <div>
            <h1 className="white-text">Chat Participants</h1>
          </div>
        )}
      </header>
      <div className="chat-history">
        {selectedFriend && (
          <div className="beginning-of-message-history">
            Beginning of message history with {selectedFriend.firstName}{" "}
            {selectedFriend.lastName}
          </div>
        )}
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

      </div>
    </div>
  );
}

export default ChatBox;
