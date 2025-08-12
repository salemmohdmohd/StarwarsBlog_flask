import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "../data/starWarsData.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save token and user info
        if (data.access_token) {
          saveToken(data.access_token);
        }
        if (data.user) {
          dispatch({ type: "set_user", payload: data.user });
        }
        setSuccess("Signup successful! Redirecting to the site...");
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 position-relative">
      <div className="bg-black rounded-3 p-4 w-100 border border-light position-relative"
           style={{
             maxWidth: '400px',
             zIndex: 3,
             backgroundColor: 'rgba(0, 0, 0, 0.85)',
             backdropFilter: 'blur(5px)',
             boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
           }}>
        <h2 className="text-center text-white mb-4">Sign Up</h2>
        {error && (
          <div className="alert alert-danger bg-danger border-danger text-danger text-center mb-3">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success bg-success border-success text-success text-center mb-3">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">Email:</label>
            <input
              type="email"
              className="form-control bg-black border-light text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-white">Password:</label>
            <input
              type="password"
              className="form-control bg-black border-light text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>
          <p className="text-center">
            <Link to="/" className="text-info">Already have an account? Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
