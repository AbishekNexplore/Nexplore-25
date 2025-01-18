const axios = require('axios');

const testRegister = async () => {
    try {
        console.log('Testing registration endpoint...');
        const response = await axios.post('http://localhost:10001/api/auth/register', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'test123456'
        });
        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
    }
};

testRegister();
