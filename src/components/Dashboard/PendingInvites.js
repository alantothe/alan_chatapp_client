import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingInvites, selectPendingInvites } from "../../features/pendingInvitesSlice";
import Avatar from "react-avatar";
import { acceptFriendRequest, rejectFriendRequest } from "../../features/userSlice";
import { selectUser } from "../../features/userSlice";
import accept from "../../svg/accept.svg"
import decline from "../../svg/decline.svg"

function PendingInvites({socket}) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const pendingInvites = useSelector(selectPendingInvites);

  useEffect(() => {
    if (user) {
      dispatch(fetchPendingInvites(user.id));

      // Subscribe to the updatePendingInvites event from the server
      socket.on("updatePendingInvites", () => {
        dispatch(fetchPendingInvites(user.id));
      });
    }

    // Clean up the subscription on unmount
    return () => {
      socket.off("updatePendingInvites");
    };
  }, [dispatch, user, socket]);

  const handleAccept = async (senderId) => {
    try {
      await dispatch(acceptFriendRequest(senderId)).unwrap();
      // Emit friendRequestAccepted event for both sender and receiver
      socket.emit('friendRequestAccepted', { senderId, receiverId: user.id });
      socket.emit('friendRequestAccepted', { senderId: user.id, receiverId: senderId });

      await dispatch(fetchPendingInvites(user.id)).unwrap();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
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
    <div className="w-full pl-20 flex flex-col items-start">
      {pendingInvites.map((request) => (
        <div
          key={request.id}
          onClick={() => handleUnitClick(request.id)}
          className="flex items-center py-4 px-6 cursor-pointer w-full justify-start"
        >
          <Avatar
            size={50}
            round
            src={request.avatar}
            alt={`${request.firstName} ${request.lastName}`}
            className="mr-4 w-12 h-12"
          />

            <div>
              <p className="text-white font-bold">{request.firstName} {request.lastName}</p>
            </div>
            <div className="flex items-center space-x-2"> {/* Adjusted the space-x- class here */}
              <button onClick={() => handleAccept(request.id)}>
                <img src={accept} alt="Accept" className="w-6 h-6" />
              </button>
              <button onClick={() => handleReject(request.id)}>
                <img src={decline} alt="Reject" className="w-6 h-6" />
              </button>
            </div>
          </div>

      ))}
    </div>
  );
}

export default PendingInvites;


