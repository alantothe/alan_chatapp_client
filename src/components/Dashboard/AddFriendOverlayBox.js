import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./AddFriendOverlayBox.css";
import socket from '../../socket';


import { sendFriendRequest } from "../../features/user/userSlice";

function AddFriendOverlayBox({ onClose, userId }) {

  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const responseAction = await dispatch(
        sendFriendRequest({ senderId: userId, recipientEmail: email })

      );
      if (responseAction.payload) {
        alert("Friend request sent!");
        const sender = responseAction.payload;


        // Emit the "send_friend_request" event after a successful friend request
        socket.emit('send_friend_request', { senderId: userId, recipientEmail: email });

      } else {
        alert("An error occurred while sending the friend request.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the friend request.");
    }
    setEmail("");
  };


  return (
    <div className="add-friend-overlay-box">
      <div className="add-friend-form-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h3>Add Friend</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}

export default AddFriendOverlayBox;

