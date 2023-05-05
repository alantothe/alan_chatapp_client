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
    if (loggedInUser && loggedInUser.id) {
      fetchConversations(loggedInUser.id);
    }
  }, [loggedInUser, activeConversation]);

  useEffect(() => {
    const handleConversationUpdated = () => {
      if (loggedInUser && loggedInUser.id) {
        fetchConversations(loggedInUser.id);
      }
    };

    socket.on("conversation_updated", handleConversationUpdated);

    // Clean up the listener when the component is unmounted
    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [loggedInUser, socket]);

  const handleClick = (conversation) => {
    dispatch(setActiveConversation(conversation));
  };

  const fetchConversations = async (userId) => {
    const response = await fetch(`/api/conversations/${userId}`);
    const data = await response.json();
    setConversations(data);
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      fetchConversations(loggedInUser.id);
    }
  }, [loggedInUser, activeConversation]);

  const conversationElements = conversations.map((conversation) => {
    const friend = conversation.friendData;

    return (
      <div
        key={conversation._id}
        onClick={() => handleClick(conversation)}
        className="flex items-center py-4 px-6 cursor-pointer w-full justify-start"
      >
        <Avatar
          size={50}
          round
          src={friend.avatar}
          alt={`${friend.firstName} ${friend.lastName}`}
          className="mr-4 w-12 h-12"
        />
        <div className="flex-1 ml-2 flex justify-start">
          <div>
            <p className="text-white font-bold">{friend.firstName} {friend.lastName}</p>
          </div>
        </div>
      </div>
    );
  })

  return (
    <div className="w-full pl-20 flex flex-col items-start">
      {conversationElements}
    </div>
  );
}

export default DirectMessages;
