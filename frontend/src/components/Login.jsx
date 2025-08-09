import React, { useState } from 'react';
import { loginUser, registerUser } from '../data/starWarsData.jsx';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLogin 
        ? await loginUser(email, password)
        : await registerUser(email, password);
      
      console.log('Auth success:', response);
      onLoginSuccess(response.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" 
         style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f1419)' }}>
      <div className="bg-dark bg-opacity-25 rounded-3 p-4 w-100 border border-light border-opacity-25"
           style={{ 
             maxWidth: '400px',
             backdropFilter: 'blur(10px)'
           }}>
        <h2 className="text-center text-white mb-4">
          {isLogin ? 'Login to Star Wars API' : 'Register for Star Wars API'}
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
            disabled={loading}
            className={`btn w-100 ${loading ? 'btn-secondary' : 'btn-primary'}`}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className="btn btn-link text-primary text-decoration-underline p-0"
            style={{ fontSize: '0.9rem' }}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
