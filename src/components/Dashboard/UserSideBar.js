import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import './dashboard.css';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';


function UserSideBar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const userData = useSelector((state) => state.user.data);

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

