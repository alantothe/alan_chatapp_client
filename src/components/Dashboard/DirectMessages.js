import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "react-avatar";
import { setActiveConversation } from "../../features/activeConversationSlice";
import { selectUser } from "../../features/userSlice";
import io from "socket.io-client";
import { selectActiveConversation } from '../../features/activeConversationSlice';

function DirectMessages() {
  const socket = io("http://localhost:4000")
  const loggedInUser = useSelector(selectUser);
  const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();
  const activeConversation = useSelector(selectActiveConversation);

  useEffect(() => {
    const handleConversationUpdated = () => {
      fetchConversations(loggedInUser.id);
    };

    socket.on("conversation_updated", handleConversationUpdated);

    // Clean up the listener when the component is unmounted
    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [loggedInUser.id, socket]);


  const handleClick = (conversation) => {
    dispatch(setActiveConversation(conversation));
  };

  const fetchConversations = async (userId) => {
    const response = await fetch(`/api/conversations/${userId}`);
    const data = await response.json();
    setConversations(data);
  };

  useEffect(() => {
    fetchConversations(loggedInUser.id);
  }, [loggedInUser.id, activeConversation]);

  const conversationElements = conversations.map((conversation) => {
    const friend = conversation.friendData;

    return (
      <div
        key={conversation._id}
        onClick={() => handleClick(conversation)}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        <Avatar
          size={50}
          round
          src={friend.avatar}
          alt={`${friend.firstName} ${friend.lastName}`}
          style={{ marginRight: "10px" }}
        />
        <p style={{ fontWeight: "bold" }}>
          {friend.firstName} {friend.lastName}
        </p>
      </div>
    );
  });

  return (
    <div>
      <h2>Direct Messages</h2>
      {conversationElements}
    </div>
  );
}

export default DirectMessages;

