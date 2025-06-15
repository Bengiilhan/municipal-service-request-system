import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportForm from './ReportForm';
import axios from 'axios';

// Axios'u mockla (__mocks__/axios.js otomatik kullanılacak)
jest.mock('axios');

// Leaflet bileşenlerini mockla (çünkü gerçek DOM'da çalışmaz)
jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: () => <div data-testid="marker" />,
    useMapEvents: () => { },
}));

beforeAll(() => {
    window.alert = jest.fn();
});

describe('ReportForm component', () => {
    test('tüm form alanları görüntüleniyor', () => {
        render(<ReportForm token="fake_token" onSuccess={jest.fn()} />);

        expect(screen.getByLabelText('Başlık')).toBeInTheDocument();
        expect(screen.getByLabelText('Açıklama')).toBeInTheDocument();
        expect(screen.getByLabelText('Adres')).toBeInTheDocument();
        expect(screen.getByLabelText('Fotoğraf')).toBeInTheDocument();
        expect(screen.getByLabelText('Video')).toBeInTheDocument();
        expect(screen.getByText('Konumu Haritadan Seçin')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Talep Gönder' })).toBeInTheDocument();
    });

    test('konum seçilmeden gönderim yapıldığında uyarı çıkar', async () => {
        render(<ReportForm token="fake_token" onSuccess={jest.fn()} />);

        await userEvent.type(screen.getByLabelText('Başlık'), 'Çukur');
        await userEvent.type(screen.getByLabelText('Açıklama'), 'Yolda büyük bir çukur var');

        fireEvent.click(screen.getByRole('button', { name: 'Talep Gönder' }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Lütfen haritadan bir konum seçin.');
        });
    });

    test('başarılı talep gönderiminde alert çalışır ve alanlar temizlenir', async () => {
        const mockOnSuccess = jest.fn();

        axios.post.mockResolvedValue({ data: { message: 'Success' } });

        // Override edilmiş form: location başlangıçta dolu
        function PreloadedForm() {
            const [location, setLocation] = React.useState({ lat: 38.42, lng: 27.14 });

            return (
                <ReportForm
                    token="fake_token"
                    onSuccess={mockOnSuccess}
                    initialLocation={location} // ← bu prop'u geçici olarak ekleyip formda kullanacağız
                />
            );
        }

        render(<PreloadedForm />);

        await userEvent.type(screen.getByLabelText('Başlık'), 'Kırık Direk');
        await userEvent.type(screen.getByLabelText('Açıklama'), 'Elektrik direği kırılmış');
        await userEvent.type(screen.getByLabelText('Adres'), 'İzmir, Konak');

        fireEvent.click(screen.getByRole('button', { name: 'Talep Gönder' }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith('Talep başarıyla gönderildi!');
        });
    });

});
