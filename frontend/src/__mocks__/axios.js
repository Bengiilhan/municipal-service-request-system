export default {
    post: jest.fn(() =>
        Promise.resolve({
            data: {
                access: 'mock_access_token',
                refresh: 'mock_refresh_token',
            }
        })
    )
};
