import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function RequestDetail({ token }) {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const navigate = useNavigate();
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

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/requests/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRequest(res.data);
            } catch (err) {
                console.error("Detay alınamadı", err);
            }
        };

        fetchRequest();
    }, [id, token]);

    if (!request) return <p>Yükleniyor...</p>;

    return (
        <div>
            {/* Geri Dön Butonu */}
            <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
                ← Geri Dön
            </button>
            <h2>{request.title}</h2>
            <p><strong>Açıklama:</strong> {request.description}</p>
            <p><strong>Durum:</strong> {getStatusLabel(request.status)}</p>

            <h3>Harita</h3>
            <MapContainer center={[request.latitude, request.longitude]} zoom={15} style={{ height: '300px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[request.latitude, request.longitude]} />
            </MapContainer>

            {request.image && (
                <>
                    <h3>Resim</h3>
                    <img
                        src={request.image}
                        alt="Şikayet görseli"
                        style={{ width: '300px' }}
                    />

                </>
            )}

            {request.video && (
                <>
                    <h3>Video</h3>
                    <video width="300" controls>
                        <source src={request.video} />
                        Tarayıcınız video etiketini desteklemiyor.
                    </video>
                </>
            )}
        </div>
    );
}

export default RequestDetail;
