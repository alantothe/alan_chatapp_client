import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingInvites, selectPendingInvites } from "../../features/pendingInvitesSlice";
import Avatar from "react-avatar";
import { acceptFriendRequest, rejectFriendRequest } from "../../features/userSlice";
import { selectUser } from "../../features/userSlice";

function PendingInvites() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const pendingInvites = useSelector(selectPendingInvites);

  useEffect(() => {
    if (user) {
      dispatch(fetchPendingInvites(user.id));
    }
  }, [dispatch, user]);

  const handleAccept = (senderId) => {
    dispatch(acceptFriendRequest(senderId)).then(() => {
      dispatch(fetchPendingInvites(user.id));
    });
  };

  const handleReject = (senderId) => {
    dispatch(rejectFriendRequest(senderId)).then(() => {
      dispatch(fetchPendingInvites(user.id));
    });
  };

  const handleUnitClick = (id) => {
    console.log(`Unit ${id} clicked`);
  };

  return (
    <div>
      <h2>Pending Friend Requests</h2>
      {pendingInvites.map((request) => (
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
