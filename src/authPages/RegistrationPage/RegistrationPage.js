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
    <div className="bg-purple-500 min-h-screen flex items-center justify-center">
  <section className="bg-gray-800 p-10 rounded-lg w-200">
    <header className="text-center">
      <h1 className="text-4xl font-bold mb-10 text-white">Registration Page</h1>
    </header>
    <form className="flex flex-col items-center space-y-6">
      <div className="formGroup w-full">
        <label htmlFor="firstName" className="text-white mb-1">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={handleFirstNameChange}
          className="bg-white rounded px-3 py-2 w-full"
        />
      </div>
      <div className="formGroup w-full">
        <label htmlFor="lastName" className="text-white mb-1">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={handleLastNameChange}
          className="bg-white rounded px-3 py-2 w-full"
        />
      </div>
      <div className="formGroup w-full">
        <label htmlFor="email" className="text-white mb-1">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="bg-white rounded px-3 py-2 w-full"
        />
      </div>
      <div className="formGroup w-full">
        <label htmlFor="password" className="text-white mb-1">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className="bg-white rounded px-3 py-2 w-full"
        />
      </div>
      <div className="formGroup w-full">
        <label className="text-white mb-1">Upload your avatar:</label>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzoneActive' : ''} bg-white rounded px-3 py-2 w-full text-center`}
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
            className="avatarPreview ml-12 mb-6 mt-6 flex items-center"
          />

        )}
        </div>

      <button
        type="submit"
        onClick={handleRegister}
        className="button bg-purple-500 text-white rounded px-5 py-2 mb-6 w-full"
      >
        Register
      </button>
      <button
        onClick={handleRedirect}
        className="button bg-transparent text-purple-500 rounded px-5 py-2 w-full"
      >
        Login?
      </button>
    </form>
  </section>
</div>

  );
}

export default RegistrationPage;

