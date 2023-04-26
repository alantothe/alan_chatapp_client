import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, selectUser, updateUser, setSelectedFriend } from "../../features/user/userSlice";
import Avatar from "react-avatar";

function FriendsBox() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(false);
  const [friends, setFriends] = useState(user.friends || []);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (user.socket) {
      user.socket.on("friend_request_accepted", () => {
        console.log("friend_request_accepted event received");
        setRefresh((prev) => !prev); // Toggle the refresh state
      });
    }
    return () => {
      if (user.socket) {
        user.socket.off("friend_request_accepted");
      }
    };
  }, [user]);

  useEffect(() => {
    if (user && !fetched) {
      dispatch(fetchUserById(user.id)).then((response) => {
        console.log("user data fetched", response);
        dispatch(updateUser(response.payload));
        setFetched(true);
      });
    }
  }, [dispatch, user, fetched]);

  useEffect(() => {
    if (user.friends) {
      setFriends(user.friends);
    }
  }, [user.friends]);

  function handleFriendClick(friend) {
    dispatch(setSelectedFriend(friend));
  }


  if (!fetched) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bar FriendsBox">
      <div className="friends">
        <h1 className="white-text centered-text">Friends</h1>
        {friends.map((friend) => {
          if (friend) {
            return (
              <div
    key={friend.id}
    onClick={() => handleFriendClick(friend)}
    style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
  >
    <Avatar
      size={50}
      round
      src={friend.avatar}
      alt={`${friend.firstName} ${friend.lastName}`}
      style={{ marginRight: "10px" }}
    />
    <p style={{ fontWeight: "bold", color: "white" }}>
      {friend.firstName} {friend.lastName}
    </p>
  </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default FriendsBox;

