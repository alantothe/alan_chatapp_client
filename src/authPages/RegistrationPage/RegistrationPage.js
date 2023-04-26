import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useDropzone } from 'react-dropzone';
import './RegistrationPage.css';

function RegistrationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setAvatar(URL.createObjectURL(acceptedFiles[0]));
      setAvatarFile(acceptedFiles[0]); // Save the File object
    },
  });

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('avatar', avatarFile);

      const response = await axios.post(`${process.env.REACT_APP_URL_ENDPOINT}/api/user/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        console.log('Error');
      }
    } catch (error) {
      console.log('Error');
    }
  };

  const handleRedirect = () => {
    navigate('/login');
  };


  return (
    <div className="container">
      <h1>Registration Page</h1>

      <div className="formGroup">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={handleLastNameChange}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className="formGroup">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="formGroup">
        <label>Upload your avatar:</label>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzoneActive' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop some files here, or click to select files</p>
          )}
        </div>
        {avatar && (
          <Avatar
            src={avatar}
            round={true}
            size="100"
            className="avatarPreview"
          />
        )}
      </div>
      <button type="submit" onClick={handleRegister} className="button">
        Register
      </button>
       <button onClick={handleRedirect} className="button">
        Login?
      </button>
    </div>
  );
}

export default RegistrationPage;

