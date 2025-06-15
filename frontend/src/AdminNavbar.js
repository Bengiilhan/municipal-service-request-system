import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function AdminNavbar({ onLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <span className="app-title">Belediye Yönetim Paneli</span>
      </div>
      <div className="navbar-right">
        <div className="navbar-links">
        <Link to="/">Yönetici Paneli</Link>
        <Link to="#" onClick={() => alert("Raporlama henüz etkin değil.")}>Raporlama</Link>
        <span className="logout-link" onClick={onLogout}>Çıkış Yap</span>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;