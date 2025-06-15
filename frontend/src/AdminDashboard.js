import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

function AdminDashboard({ token }) {
    const [requests, setRequests] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Şikayetleri çek
    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/requests/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (error) {
            console.error("Şikayet verileri alınamadı:", error);
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return <span className="status status-pending">Beklemede</span>;
            case 'in_progress':
                return <span className="status status-in_progress">İşlemde</span>;
            case 'resolved':
                return <span className="status status-resolved">Tamamlandı</span>;
            default:
                return status;
        }
    };
    const getMarkerIcon = (status) => {
        const iconUrl = {
            pending: '/marker-yellow.png',
            in_progress: '/marker-blue.png',
            resolved: '/marker-green.png'
        }[status]

        return new L.Icon({
            iconUrl,
            iconSize: [35, 45],
            iconAnchor: [17, 42],
            popupAnchor: [0, -40],
        });
    };
    const filteredRequests = requests.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
    );


    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/user-info/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAdmin(res.data.is_staff);
            } catch {
                setIsAdmin(false);
            }
        };

        checkAdmin();
        fetchRequests();

        // 15 saniyede bir güncelle
        const interval = setInterval(fetchRequests, 15000);
        return () => clearInterval(interval); // Temizle
    }, [token]);

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/requests/${id}/`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Değişiklik sonrası tekrar verileri çek
            fetchRequests();
        } catch (err) {
            console.error("Durum güncellenemedi:", err);
        }
    };

    const deleteRequest = async (id) => {
        if (!window.confirm("Bu talebi silmek istediğinizden emin misiniz?")) return;
        try {
            await axios.patch(`http://127.0.0.1:8000/api/mark-deleted/${id}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRequests();
        } catch (err) {
            console.error('Silme hatası:', err);
        }
    };


    const restoreRequest = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/undo-deletion/${id}/`, {

                is_deleted: false
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRequests();
        } catch (err) {
            console.error('Talep geri alınamadı:', err);
        }
    };

    if (!isAdmin) return <p></p>;

    return (
        <div>
            <h2>Yönetici Paneli - Tüm Talepler</h2>

            <MapContainer
                center={[38.4192, 27.1287]}
                zoom={12}
                style={{
                    height: "400px",
                    width: "70%",
                    margin: "1rem auto",
                    border: "1px solid #ccc",
                    borderRadius: "10px"
                }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {requests
                    .filter(req => !req.is_deleted)  // Sadece silinmeyenleri göster
                    .map(req => (
                        <Marker
                            key={req.id}
                            position={[req.latitude, req.longitude]}
                            icon={getMarkerIcon(req.status)} 
                        >
                            <Popup>
                                <strong>{req.title}</strong><br />
                                {req.description}<br />
                                <div>
                                    Durum: {getStatusLabel(req.status)}
                                </div>
                            </Popup>
                        </Marker>

                    ))}
            </MapContainer>


            <div className="table-wrapper">

                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Talep ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" className="search-button">
                            Ara
                        </button>

                    </div>
                </div>

                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Açıklama</th>
                            <th>Adres</th>
                            <th>Durum</th>
                            <th>İşlem</th>
                            <th>Detay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id} className={req.is_deleted ? 'deleted-row' : ''}>
                                <td>{req.title}</td>
                                <td>{req.description}</td>
                                <td>{req.address}</td> {/* Yeni */}
                                <td>{getStatusLabel(req.status)}</td>
                                <td>
                                    {!req.is_deleted ? (
                                        <>
                                            <button onClick={() => updateStatus(req.id, 'in_progress')} className="action-button">İşleme Al</button>
                                            <button onClick={() => updateStatus(req.id, 'resolved')} className="action-button">Tamamlandı</button>
                                            <button onClick={() => deleteRequest(req.id)} className="delete-btn">Sil</button>
                                        </>
                                    ) : (
                                        <button onClick={() => restoreRequest(req.id)} className="restore-btn">Geri Al</button>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/admin-dashboard/${req.id}`}>
                                        <button className="detail-button">Detay</button>
                                    </Link>
                                </td>

                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
