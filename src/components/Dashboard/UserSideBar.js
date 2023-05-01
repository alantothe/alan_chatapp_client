import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import './dashboard.css';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';

import settings from '../../svg/settings.svg';
import exit from '../../svg/exit.svg';

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
          <Avatar src={userData.avatar} size="45" round={true} className="avatar" />
        </div>
      )}
      <div>
        <div className="flex justify-center">
          <button onClick={handleUserSettings}>
            <img src={settings} alt="User settings" className="h-12 w-12 pb-3" />
          </button>
        </div>
        <div className="flex justify-center">
          <button onClick={handleLogout}>
            <img src={exit} alt="Logout" className="h-12 w-12 pb-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSideBar;
