import React, { useState, useRef} from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ setLocation, setAddress }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click: async (e) => {
            const latlng = e.latlng;
            setPosition(latlng);
            setLocation(latlng);

            // Reverse Geocoding: Koordinattan adres al
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
                );
                const data = await res.json();
                if (data && data.display_name) {
                    setAddress(data.display_name);
                } else {
                    setAddress("Adres alınamadı");
                }
            } catch (error) {
                console.error("Adres alınamadı:", error);
                setAddress("Adres alınamadı");
            }
        }
    });

    return position === null ? null : <Marker position={position}></Marker>;
}

function ReportForm({ token, initialLocation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(initialLocation || null);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [address, setAddress] = useState('');
    const imageRef = useRef();
    const videoRef = useRef();

    const bounds = [
        [38.0, 26.5],
        [38.85, 27.6]
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location) {
            alert("Lütfen haritadan bir konum seçin.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("latitude", location.lat);
        formData.append("longitude", location.lng);
        formData.append("address", address);

        if (image) formData.append("image", image);
        if (video) formData.append("video", video);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/requests/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Başarılı gönderim sonrası temizleme ve mesaj
            setTitle('');
            setDescription('');
            setLocation(null);
            setAddress('');
            setImage(null);
            setVideo(null);
            if (imageRef.current) imageRef.current.value = '';
            if (videoRef.current) videoRef.current.value = '';
            alert("Talep başarıyla gönderildi!");

        } catch (err) {
            console.error(err);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    const fetchAddress = async (lat, lng) => {
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            setAddress(res.data.display_name);
        } catch (error) {
            console.error("Adres alınamadı", error);
        }
    };

    React.useEffect(() => {
        if (location) {
            fetchAddress(location.lat, location.lng);
        }
    }, [location]);

    return (
        <div className="container">
            <h3>Yeni Talep Bildir</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Başlık</label>
                <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />

                <label htmlFor="description">Açıklama</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />

                <label htmlFor="address">Adres</label>
                <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Konumu haritadan seçin veya düzenleyin" />

                <label htmlFor="image">Fotoğraf</label>
                <input id="image" ref={imageRef} type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />

                <label htmlFor="video">Video</label>
                <input id="video" ref={videoRef} type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} />

                <label>Konumu Haritadan Seçin</label>
                <MapContainer center={[38.42, 27.14]} zoom={12} style={{ height: "300px", marginBottom: "20px" }} maxBounds={bounds}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker setLocation={setLocation} setAddress={setAddress} />
                </MapContainer>

                <button type="submit">Talep Gönder</button>
            </form>
        </div>
    );
}

export default ReportForm;
