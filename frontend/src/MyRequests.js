import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyRequests({ token }) {
    const [requests, setRequests] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/user-info/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserId(res.data.id);
        } catch (err) {
            console.error('Kullanıcı bilgisi alınamadı:', err);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/requests/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error('Şikayetler alınamadı', err);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchRequests();
    }, []);

    const myRequests = requests.filter(req => req.citizen === userId);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return <span className="status status-pending">Beklemede</span>;
            case 'in_progress': return <span className="status status-in_progress">İşlemde</span>;
            case 'resolved': return <span className="status status-resolved">Tamamlandı</span>;
            default: return status;
        }
    };

    return (

        <div className="wide-container">
            <h3 className="table-title">Benim Taleplerim</h3>
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
                    {myRequests.map(req => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyRequests;
