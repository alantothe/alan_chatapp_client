import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, selectUser, updateUser } from "../../features/user/userSlice";
import { acceptFriendRequest, rejectFriendRequest } from "../../features/user/userSlice";
import Avatar from "react-avatar";

const URL = "http://localhost:4000";
const socket = io(URL, {
  autoConnect: false,
});

function PendingInvites() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(false);
  const [requests, setRequests] = useState(user.friendRequests);

  useEffect(() => {
    if (user) {
      // Connect the socket and register the user's email
      socket.connect();
      socket.emit("register_email", { email: user.email });
      console.log(user.email)
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (user && !fetched) {
      dispatch(fetchUserById(user.id)).then((response) => {
        dispatch(updateUser(response.payload));
        setFetched(true);
      });
    }
  }, [dispatch, user, fetched]);

  useEffect(() => {
    socket.on("send_friend_request", () => {
      console.log("Received friend request");
      setFetched(false); // reset fetched state to refetch data
    });
    return () => {
      socket.off("send_friend_request");
    };
  }, []);
  useEffect(() => {
    setRequests(user.friendRequests);
  }, [user.friendRequests]);

  useEffect(() => {
    socket.on("accept_friend_request", () => {
      console.log("Friend request accepted");
      setFetched(false); // reset fetched state to refetch data
    });
    return () => {
      socket.off("accept_friend_request");
    };
  }, []);

  const handleAccept = (senderId) => {
    dispatch(acceptFriendRequest(senderId)).then(() => {
      setRequests(requests.filter(request => request.id !== senderId));
    });
  };

  const handleReject = (senderId) => {
    dispatch(rejectFriendRequest(senderId)).then(() => {
      setRequests(requests.filter(request => request.id !== senderId));
    });
  };

  const handleUnitClick = (id) => {
    console.log(`Unit ${id} clicked`);
    // TODO: populate another component based on the clicked unit
  };

  if (!fetched) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Pending Friend Requests</h2>
      {requests.map((request) => (
        <div key={request.id} onClick={() => handleUnitClick(request.id)}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Avatar size={40} round src={request.avatar} alt={`${request.firstName} ${request.lastName}`} style={{marginRight: '10px'}} />
            <p style={{fontWeight: 'bold', color: 'white', lineHeight: '40px'}}>{request.firstName} {request.lastName}</p>
          </div>
          <button onClick={() => handleAccept(request.id)}>Accept</button>
          <button onClick={() => handleReject(request.id)}>Reject</button>
        </div>
      ))}
    </div>
  );

}

export default PendingInvites;


