import React from 'react';
import { API_URL } from "../api";

function Login() {
  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };
  const handleLogout = () => {
    window.location.href = `${API_URL}/auth/logout`;
  };

  return (
    <div>
      <div>
        <h2>Login</h2>
        <button onClick={handleLogin}>Sign in with Google</button>
      </div>
      <div>
        <h2>Logout</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Login;
