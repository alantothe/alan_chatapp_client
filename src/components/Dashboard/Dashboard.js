import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import './dashboard.css';
import UserSideBar from './UserSideBar';
import MainSideBar from './MainSideBar';
import ChatBox from './ChatBox';
import FriendsBox from './FriendsBox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, selectSelectedFriend } from '../../features/userSlice';
import AddFriendBox from './AddFriendOverlayBox';


function Dashboard() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddFriendBox, setShowAddFriendBox] = useState(false);
  const [userData, setUserData] = useState(null);
  const selectedFriend = useSelector(selectSelectedFriend);

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
  }, [dispatch, user]);




  return (
    <div className="bar-container">
      <UserSideBar userData={userData} />
      <MainSideBar onAddFriendClick={() => setShowAddFriendBox(true)} />
      <ChatBox selectedFriend={selectedFriend}/>
      <FriendsBox />
      {showAddFriendBox && <AddFriendBox onClose={() => setShowAddFriendBox(false)} />}
    </div>
  );
}

export default Dashboard;
