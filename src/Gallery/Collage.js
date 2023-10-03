import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';
import './Collage.css'; // Import your custom CSS

function LoginForm() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
    setLoginError(false); // Clear any login error on username change
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setLoginError(false); // Clear any login error on password change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:1001/getAdminCredentials');
      const adminCredentials = response.data;

      if (userName === adminCredentials.userName && password === adminCredentials.password) {
        // Use navigate to redirect to "/Contact" page if login is successful
        navigate('/Contact');
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error('Error fetching admin credentials:', error);
    }
  };

  return (
    <div>
       <Link className="back_Link"
                to={"/"}
              >
                Go Back
              </Link>
    <div className="login-form-container">
      <h2 className='h2_class'>Administrator Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">Username:</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="userName"
              className="form-control"
              value={userName}
              onChange={handleUserNameChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="input-wrapper">
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="red_button">
          Login
        </button>
        {loginError && <p className="login-error">Admin login or password incorrect</p>}
      </form>
    </div>
    </div>
  );
}

export default LoginForm;
