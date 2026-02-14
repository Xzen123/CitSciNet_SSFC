// backend/debug-obs.js
async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/observations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project_id: 1,
                type: 'water_quality',
                latitude: 20.5,
                longitude: 78.9,
                description: 'Debug Test',
                measurements: { ph: "7.0", temperature: "25" },
                photo_urls: []
            })
        });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', text);
    } catch (e) { console.error('Error:', e.message); }
}
run();
