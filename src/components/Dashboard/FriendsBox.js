import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFriendsByUserId, selectFriends } from "../../features/friendsSlice";
import Avatar from "react-avatar";
import { selectUser } from "../../features/userSlice";
import { setActiveConversation } from "../../features/activeConversationSlice";
import io from 'socket.io-client'

function FriendsBox() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Get the user data
  const userId = user?.id; // Get the userId from the user data
  const friends = useSelector(selectFriends);
  const friendsStatus = useSelector((state) => state.friends.status);
  const friendsError = useSelector((state) => state.friends.error);
  const socket = io("http://localhost:4000");

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
        socket.emit("conversation_updated")
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
        className="flex items-center py-4 px-6 cursor-pointer w-full justify-start"
      >
        <Avatar
          src={friend.avatar}
          size="50"
          round={true}
          className="mr-4 w-12 h-12"
        />
        <div className="flex-1 ml-2 flex justify-start">
          <div>
            <p className="text-white font-bold">
              {friend.firstName} {friend.lastName}
            </p>
          </div>
        </div>
      </div>
    ));
  } else if (friendsStatus === "failed") {
    content = <div>Error: {friendsError}</div>;
  }

  return (
    <div className="bar FriendsBox">
      <h1 className="text-white text-center text-3xl pt-3">Friends</h1>

      {content}
    </div>
  );
}

export default FriendsBox;



