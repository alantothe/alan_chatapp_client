import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import './dashboard.css';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';


function UserSideBar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const userData = useSelector(selectUser);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserSettings = () => {
    navigate('/user');
  };

  return (
    <div className="bar UserSideBar">
      {userData && userData.avatar && (
        <div className="avatar-container">
          <Avatar src={userData.avatar} size="50" round={true} className="avatar" />
        </div>
      )}
      <div>
        <button onClick={handleUserSettings}>USER SETTING</button>
        <button onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
}

export default UserSideBar;

