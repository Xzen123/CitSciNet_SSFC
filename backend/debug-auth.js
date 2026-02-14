// backend/debug-auth.js
async function run() {
    try {
        const API = 'http://localhost:5000/api/auth';

        // 1. Register
        console.log('Registering...');
        const regRes = await fetch(`${API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Scientist',
                email: 'test' + Date.now() + '@citscinet.org',
                password: 'password123',
                role: 'citizen'
            })
        });
        const regData = await regRes.json();
        console.log('Register Status:', regRes.status);
        console.log('User:', regData);

        if (regRes.status !== 201) return;

        // 2. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: regData.email,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Token received:', !!loginData.token);

    } catch (e) { console.error('Error:', e.message); }
}
run();
