import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function UserNavbar({ onLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <span className="app-title">Belediye Hizmet Talebi Sistemi</span>
      </div>
      <div className="navbar-right">
        <div className="navbar-links">
        <Link to="/">Talep Oluştur</Link>
        <Link to="/my-requests">Benim Taleplerim</Link>
        <Link to="/all-requests">Tüm Talepler</Link>
        <Link to="#" onClick={() => alert("Bildirimler henüz etkin değil.")}>Bildirimler</Link>
        
        <span className="logout-link" onClick={onLogout}>Çıkış Yap</span>
        </div>
      </div>
    </div>
  );
}

export default UserNavbar;

