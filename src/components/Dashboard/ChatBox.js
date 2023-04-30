import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectActiveConversation } from "../../features/activeConversationSlice";
import Avatar from "react-avatar";
import { sendMessage, fetchMessages, selectMessages } from "../../features/messagesSlice";
import { selectUser } from "../../features/userSlice";
import { useDispatch } from "react-redux";

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
  }
}, [dispatch, activeConversation, user]);

const handleSendMessage = () => {
  if (inputMessage.trim() !== "") {
    dispatch(sendMessage({ senderId: user.id, receiverId: activeConversation.friendData.id, content: inputMessage }));
    setInputMessage("");
    console.log(activeConversation.friendData.id)
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
          </div>
        ) : (
          <div className="beginning-of-message-history">
            <h3>Please Click On a Friend To Start Chat</h3>
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
