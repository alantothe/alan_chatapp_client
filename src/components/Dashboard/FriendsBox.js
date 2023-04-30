import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFriendsByUserId, selectFriends } from "../../features/friendsSlice";
import Avatar from "react-avatar";
import { selectUser } from "../../features/userSlice";
import { setActiveConversation } from "../../features/activeConversationSlice";

function FriendsBox() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Get the user data
  const userId = user?.id; // Get the userId from the user data
  const friends = useSelector(selectFriends);
  const friendsStatus = useSelector((state) => state.friends.status);
  const friendsError = useSelector((state) => state.friends.error);

  useEffect(() => {
    if (userId && friendsStatus === "idle") {
      dispatch(fetchFriendsByUserId(userId));
    }
  }, [dispatch, friendsStatus, userId]);
  const handleFriendClick = async (friend) => {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        friendId: friend.id,
      }),
    });

    if (response.ok) {
      const newConversation = await response.json();
      const updatedConversation = {
        ...newConversation,
        friendData: friend,
      };
      dispatch(setActiveConversation(updatedConversation));
    } else {
      const existingConversation = await fetch(
        `/api/conversations/${user.id}`
      ).then((res) => res.json());

      const selectedConversation = existingConversation.find((conversation) =>
        conversation.participants.some((participant) => participant.id === friend.id)
      );

      if (selectedConversation) {
        dispatch(setActiveConversation(selectedConversation));
      }
    }
  };



  let content;
  if (friendsStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (friendsStatus === "succeeded") {
    content = friends.map((friend) => (
      <div
        key={friend.id}
        onClick={() => handleFriendClick(friend)}
      >
        <Avatar src={friend.avatar} size="40" round={true} />
        <span>
          {friend.firstName} {friend.lastName}
        </span>
      </div>
    ));
  } else if (friendsStatus === "failed") {
    content = <div>Error: {friendsError}</div>;
  }

  return (
    <div className="bar FriendsBox">
      <h1 className="white-text centered-text">Friends</h1>
      {content}
    </div>
  );
}

export default FriendsBox;





