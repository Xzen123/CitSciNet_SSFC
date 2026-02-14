const axios = require('axios');
const { pool } = require('./config/db');

const API_URL = 'http://localhost:5000/api';

async function testGeofence() {
    try {
        console.log('🧪 Testing Geofencing Logic...');

        // 1. Login to get token
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'rahul@citizen.in',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        console.log('✅ Logged in as Rahul');

        // 2. Get "Ganges River Watch" Project (ID: 1 usually, but let's fetch to be sure)
        // Center: 25.3176, 82.9739 (Varanasi)
        const projectsRes = await axios.get(`${API_URL}/projects`);
        const gangesProject = projectsRes.data.find(p => p.title.includes('Ganges'));

        if (!gangesProject) {
            console.error('❌ Could not find Ganges project');
            return;
        }
        console.log(`🎯 Target Project: ${gangesProject.title} (ID: ${gangesProject.id})`);

        // 3. Test VALID Submission (Within ~5km)
        // 25.35, 83.00 is nearby
        console.log('\n--- Attempting VALID Submission (Within 5km) ---');
        try {
            const validPayload = {
                project_id: gangesProject.id,
                type: 'water_quality',
                latitude: 25.32,
                longitude: 82.98, // Very close
                measurements: { ph: 7 },
                description: 'Test Valid Location'
            };
            const res = await axios.post(`${API_URL}/observations`, validPayload, { headers });
            console.log(`✅ Success! Response Status: ${res.status}`);
            console.log(`   Obs ID: ${res.data.id}, Status: ${res.data.status}`);
        } catch (err) {
            console.error('❌ Failed Valid Test:', err.response?.data || err.message);
        }

        // 4. Test INVALID Submission (Far away - Mumbai)
        // 19.07, 72.87
        console.log('\n--- Attempting INVALID Submission (Mumbai -> Ganges Project) ---');
        try {
            const invalidPayload = {
                project_id: gangesProject.id,
                type: 'water_quality',
                latitude: 19.07,
                longitude: 72.87,
                measurements: { ph: 7 },
                description: 'Test Invalid Location'
            };
            await axios.post(`${API_URL}/observations`, invalidPayload, { headers });
            console.error('❌ Error! Should have failed but succeeded.');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log(`✅ Correctly Blocked! Error: ${err.response.data.error}`);
            } else {
                console.error('❌ Failed with unexpected error:', err.message);
            }
        }

    } catch (err) {
        console.error('Test script error:', err.message);
    }
}

testGeofence();
