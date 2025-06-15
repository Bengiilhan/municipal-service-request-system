import React from 'react';
import '@testing-library/jest-dom'; // 🔹 jest-dom matchers aktifleşir
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import axios from 'axios';

// 🔧 window.alert mock'u
beforeAll(() => {
    window.alert = jest.fn();
});

// 🔧 axios mock'u
jest.mock('axios'); // Bu satır artık __mocks__/axios.js dosyasını otomatik olarak alır


describe('Login component', () => {
    test('giriş formu ve alanlar doğru görünüyor', () => {
        render(<Login onLogin={jest.fn()} />);
        expect(screen.getByPlaceholderText('Kullanıcı Adı')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Şifre')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Giriş Yap' })).toBeInTheDocument();

    });

    test('başarılı giriş sonrası onLogin çağrılır', async () => {
        const mockOnLogin = jest.fn();

        // Axios post çağrısını taklit et
        axios.post.mockResolvedValue({
            data: {
                access: 'access_token',
                refresh: 'refresh_token',
            },
        });

        render(<Login onLogin={mockOnLogin} />);

        await userEvent.type(screen.getByPlaceholderText('Kullanıcı Adı'), 'testuser');
        await userEvent.type(screen.getByPlaceholderText('Şifre'), 'testpass');

        fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));

        await waitFor(() => {
            expect(mockOnLogin).toHaveBeenCalledWith('access_token');
        });

        expect(localStorage.getItem('token')).toBe('access_token');
        expect(localStorage.getItem('refresh')).toBe('refresh_token');
    });
});
