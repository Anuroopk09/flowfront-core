import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authenticateUser } from '../lib/utils';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(username, password);
    if (user) {
      login(user);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('Signup functionality would be implemented with a backend database');
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card p-5" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Student ERP System</h2>
          <p className="text-muted">Sign in to continue</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h6>Demo Accounts:</h6>
          <small className="text-muted d-block">Admin: admin / admin123</small>
          <small className="text-muted d-block">Teacher: teacher1 / teacher123</small>
          <small className="text-muted d-block">Student: student1 / student123</small>
        </div>
      </div>
    </div>
  );
};

export default Login;