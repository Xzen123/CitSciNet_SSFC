// backend/debug-get.js
async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/observations');
        const data = await res.json();
        console.log('Total Observations:', data.length);
        if (data.length > 0) {
            console.log('Latest Observation:', data[data.length - 1]);
        }
    } catch (e) { console.log(e.message); }
}
run();
