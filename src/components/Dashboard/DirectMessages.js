import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addConversation, removeConversation,} from "../../features/conversationsSlice";
import { selectSelectedFriend } from "../../features/user/userSlice";
import Avatar from "react-avatar";

function DirectMessages() {
  const selectedFriend = useSelector(selectSelectedFriend);
  const conversations = useSelector((state) => state.conversations);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedFriend) {
      dispatch(
        addConversation({
          id: selectedFriend.id,
          firstName: selectedFriend.firstName,
          lastName: selectedFriend.lastName,
          avatar: selectedFriend.avatar,
        })
      );
    }
  }, [selectedFriend, dispatch]);

  const handleRemoveConversation = (id) => {
    dispatch(removeConversation(id));
  };

  return (
    <div>
      <h2>Direct Messages</h2>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Avatar
            size={50}
            round
            src={conversation.avatar}
            alt={`${conversation.firstName} ${conversation.lastName}`}
            style={{ marginRight: "10px" }}
          />
          <p style={{ fontWeight: "bold" }}>
            {conversation.firstName} {conversation.lastName}
          </p>
          {/* Add a button to remove the conversation for debugging */}
          <button
            onClick={() => handleRemoveConversation(conversation.id)}
            style={{ marginLeft: "10px" }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default DirectMessages;
