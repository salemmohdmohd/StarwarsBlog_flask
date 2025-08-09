import React, { useState, useEffect, useRef } from 'react';
import { loginUser } from '../data/starWarsData.jsx';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [animationClass, setAnimationClass] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    // Play theme song on component load
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay prevented:', error);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(email, password);
      console.log('Login success:', response);
      
      // Trigger exit animation before login success
      setAnimationClass('login-credits-exit-ultra-slow');
      
      // Wait for animation to complete before calling onLoginSuccess
      setTimeout(() => {
        onLoginSuccess(response.user);
      }, 12000); // 12 seconds to match ultra-slow animation duration
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" >
      <div className={`bg-black rounded-3 p-4 w-100 border border-light ${animationClass}`}
           style={{ 
             maxWidth: '400px',
           }}>
        <h2 className="text-center text-white mb-4">
          Login to Star Wars Blog
        </h2>
        
        {error && (
          <div className="alert alert-danger bg-danger  border-danger  text-danger text-center mb-3">
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
              className="form-control bg-black  border-light text-white"
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
              className="form-control bg-black  border-light text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="123456"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
          >
            Login
          </button>
          <p className="text-center text-white mb-4">
          To sign up, please contact the admin and pay a small fee of 1b.
          Test;
          user: 1@1.com
          pass: 123456
        </p>
        </form>
        
        <audio 
          ref={audioRef}
          src="https://ia600304.us.archive.org/30/items/StarWarsTheImperialMarchDarthVadersTheme/Star%20Wars-%20The%20Imperial%20March%20(Darth%20Vader's%20Theme).mp3"
          preload="auto"
          loop
        />
      </div>
    </div>
  );
};

export default Login;
