import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import './dashboard.css';
import UserSideBar from './UserSideBar';
import MainSideBar from './MainSideBar';
import ChatBox from './ChatBox';
import FriendsBox from './FriendsBox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, selectUser, selectSelectedFriend } from '../../features/userSlice';
import AddFriendBox from './AddFriendOverlayBox';
import { io } from 'socket.io-client';

function Dashboard() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddFriendBox, setShowAddFriendBox] = useState(false);
  const [userData, setUserData] = useState(null);
  const selectedFriend = useSelector(selectSelectedFriend);
  const [socket, setSocket] = useState(null);
  const endpoint = 'http://localhost:4000';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (user && user.id) {
      console.log('User object:', user);
      dispatch(fetchUserById(user.id));
    }
  }, [isLoggedIn, navigate, dispatch, user]);

  useEffect(() => {
    if (user && user.id) {
      const newSocket = io(endpoint);
      setSocket(newSocket);

      dispatch(fetchUserById(user.id))
        .unwrap()
        .then((userData) => {
          console.log('User data from fetchUserById action:', userData);
          setUserData(userData);
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
    }
  }, [dispatch, endpoint, user]);


  const sendMessage = async (messageContent) => {
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userData.id,
          receiverId: selectedFriend.id,
          content: messageContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Message sent successfully.");
      } else {
        console.error("Error sending message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('user_data_updated', (data) => {
        if (userData && userData.id === data.id) {
          setUserData(data);
        }
      });

      socket.on('friend_request_received', (data) => {
        if (userData && userData.id === data.receiverId) {
          setUserData({
            ...userData,
            friendRequests: [...userData.friendRequests, data.friendRequest],
          });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, userData]);
  return (
    <div className="bar-container">
      <UserSideBar userData={userData} />
      <MainSideBar onAddFriendClick={() => setShowAddFriendBox(true)} />
      <ChatBox selectedFriend={selectedFriend} sendMessage={sendMessage} socket={socket} />
      <FriendsBox />
      {showAddFriendBox && <AddFriendBox onClose={() => setShowAddFriendBox(false)} />}
    </div>
  );
}

export default Dashboard;

