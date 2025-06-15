import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import Navbar from './Navbar';
import ReportForm from './ReportForm';
import AdminDashboard from './AdminDashboard';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RequestDetail from './RequestDetail';
import AllRequests from './AllRequests';
import MyRequests from './MyRequests';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';
import './App.css';

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh: refreshToken
          });
          const newAccessToken = res.data.access;
          localStorage.setItem("token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token geçersiz:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        setCheckingRole(true);
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/user-info/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setIsAdmin(response.data.is_staff);
        } catch (err) {
          console.error('Kullanıcı bilgisi alınamadı.');
        } finally {
          setCheckingRole(false);
        }
      }
    };
    fetchUserInfo();
  }, [token]);

  useEffect(() => {
    const handleShowRegister = () => setShowRegister(true);
    window.addEventListener('show-register', handleShowRegister);
    return () => window.removeEventListener('show-register', handleShowRegister);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  };
  return (
    <Router>
      <div>
        {/* Navbar */}
        {token ? (
          checkingRole ? null : isAdmin ? (
            <AdminNavbar onLogout={handleLogout} />
          ) : (
            <UserNavbar onLogout={handleLogout} />
          )
        ) : (
          <Navbar />
        )}


        <Routes>
          <Route path="/" element={
            token ? (
              checkingRole ? (
                <p>Yükleniyor...</p>
              ) : isAdmin ? (
                <AdminDashboard token={token} />
              ) : (
                <ReportForm token={token} />
              )
            ) : showRegister ? (
              <Register onBack={() => setShowRegister(false)} />
            ) : (
              <Login onLogin={setToken} />
            )
          } />

          <Route path="/admin-dashboard/:id" element={<RequestDetail token={token} />} />
          <Route path="/report" element={<ReportForm token={token} />} />
          <Route path="/my-requests" element={<MyRequests token={token} />} />
          <Route path="/all-requests" element={<AllRequests token={token} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
