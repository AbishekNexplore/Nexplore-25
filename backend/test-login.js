const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Testing login endpoint...');
        const response = await axios.post('http://localhost:10001/api/auth/login', {
            email: 'test@example.com',
            password: 'test123456'
        });
        console.log('Login successful:', response.data);
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        console.error('Full error:', error);
    }
};

testLogin();
