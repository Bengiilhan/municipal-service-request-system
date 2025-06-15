import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function AllRequests({ token }) {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const bounds = [
        [38.0, 26.5],
        [38.85, 27.6]
    ];

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/requests/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error('Tüm talepler alınamadı', err);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 15000);
        return () => clearInterval(interval);
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return <span className="status status-pending">Beklemede</span>;
            case 'in_progress': return <span className="status status-in_progress">İşlemde</span>;
            case 'resolved': return <span className="status status-resolved">Tamamlandı</span>;
            default: return status;
        }
    };

    const getMarkerIcon = (status) => {
        const iconUrl = {
            pending: '/marker-yellow.png',
            in_progress: '/marker-blue.png',
            resolved: '/marker-green.png',
        }[status] || '/marker-default.png';

        return new L.Icon({
            iconUrl,
            iconSize: [35, 40],
            iconAnchor: [24, 48],
            popupAnchor: [0, -45],
        });
    };

    const filteredRequests = requests.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="all-requests-page">
            <div className="map-card">
                <MapContainer
                    center={[38.4192, 27.1287]}
                    zoom={12}
                    maxBounds={bounds}
                    maxBoundsViscosity={1.0}
                    className="map-container"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {filteredRequests.map(req => (
                        <Marker
                            key={req.id}
                            position={[req.latitude, req.longitude]}
                            icon={getMarkerIcon(req.status)}
                        >
                            <Popup>
                                <strong>{req.title}</strong><br />
                                {req.description}<br />
                                Durum: {getStatusLabel(req.status)}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div className="table-wrapper">
                <h3 className="table-title">Tüm Talepler</h3>

                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Talep ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button" onClick={() => { }}>
                            Ara
                        </button>
                    </div>
                </div>


                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Açıklama</th>
                            <th>Durum</th>
                            <th>Adres</th>
                            <th>Tarih</th>
                            <th>Detay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(req => (
                                <tr key={req.id}>
                                    <td>{req.title}</td>
                                    <td>{req.description}</td>
                                    <td>{getStatusLabel(req.status)}</td>
                                    <td>{req.address}</td>
                                    <td>{new Date(req.created_at).toLocaleString()}</td>
                                    <td>
                                        <Link to={`/admin-dashboard/${req.id}`} className="detail-button">
                                            Detay
                                        </Link>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                    Aramanıza uygun talep bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllRequests;
