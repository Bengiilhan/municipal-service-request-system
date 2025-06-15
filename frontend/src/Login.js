import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh", refreshToken);

      onLogin(accessToken);
    } catch (error) {
      console.error('Giriş hatası:', error.response?.data || error.message);
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img
          src="/saat-kulesi-illustration.png"
          alt="Belediye Logosu"
          className="login-logo"
        />
      </div>
      <div className="auth-wrapper">
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Giriş Yap</h2>

          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Giriş Yap</button>

          {/* Kayıt ol bağlantısı */}
          <p className="register-prompt">
            Hesabınız yok mu?{' '}
            <button
              type="button"
              className="register-button"
              onClick={() => window.dispatchEvent(new CustomEvent('show-register'))}
            >
              Kayıt Ol
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
