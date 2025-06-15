import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './Register';
import axios from 'axios';

// Axios mock'u (jest otomatik __mocks__/axios.js dosyasını kullanacak)
jest.mock('axios');

// window.alert mock'u
beforeAll(() => {
    window.alert = jest.fn();
});

describe('Register component', () => {
    test('form alanları ve butonlar görünür', () => {
        render(<Register onBack={jest.fn()} />);

        expect(screen.getByPlaceholderText('Kullanıcı Adı')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Şifre')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Kayıt Ol' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Girişe Dön' })).toBeInTheDocument();
    });

    test('kayıt formu başarıyla gönderildiğinde alert ve onBack çağrılır', async () => {
        const mockOnBack = jest.fn();

        axios.post.mockResolvedValue({
            data: { message: 'Kayıt başarılı!' },
        });

        render(<Register onBack={mockOnBack} />);

        await userEvent.type(screen.getByPlaceholderText('Kullanıcı Adı'), 'testuser');
        await userEvent.type(screen.getByPlaceholderText('Şifre'), 'testpass');

        fireEvent.click(screen.getByRole('button', { name: 'Kayıt Ol' }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/register/',
                { username: 'testuser', password: 'testpass' }
            );
            expect(window.alert).toHaveBeenCalledWith("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            expect(mockOnBack).toHaveBeenCalled();
        });
    });
});
