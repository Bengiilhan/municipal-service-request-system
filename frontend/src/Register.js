import React, { useState } from 'react';
import axios from 'axios';

function Register({ onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username,
        password
      });
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      onBack();  // Giriş sayfasına geri dön
    } catch (error) {
      alert(error.response?.data?.error || "Kayıt başarısız!");
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
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Kayıt Ol</h2>

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

          <button type="submit">Kayıt Ol</button>

          <p className="register-prompt">
            Zaten hesabınız var mı?{' '}
            <button type="button" className="register-button" onClick={onBack}>
              Girişe Dön
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
