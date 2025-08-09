import React, { useState } from 'react';
import { loginUser } from '../data/starWarsData.jsx';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(email, password);
      console.log('Login success:', response);
      onLoginSuccess(response.user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" >
      <div className="bg-dark bg-opacity-25 rounded-3 p-4 w-100 border border-light border-opacity-25"
           style={{ 
             maxWidth: '400px',
             backdropFilter: 'blur(10px)'
           }}>
        <h2 className="text-center text-white mb-4">
          Login to Star Wars API
        </h2>
        
        {error && (
          <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger text-center mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">
              Email:
            </label>
            <input
              type="email"
              className="form-control bg-dark bg-opacity-25 border-light border-opacity-50 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="1@1.com"
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-white">
              Password:
            </label>
            <input
              type="password"
              className="form-control bg-dark bg-opacity-25 border-light border-opacity-50 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="123456"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
