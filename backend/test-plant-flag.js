
async function testPlantFlagging() {
    try {
        console.log('🌱 Testing Plant Observation Flagging...');

        // 1. Submit a "low confidence" plant observation
        // The backend flags plants if confidence < 0.8
        const payload = {
            type: 'plant',
            latitude: 40.7128,
            longitude: -74.0060,
            date: new Date().toISOString(),
            description: 'Test Plant Submission for Flagging',
            measurements: {
                species: 'Unknown Weed',
                height: '10cm',
                confidence: 0.5 // This should trigger the flag
            },
            status: 'pending' // Default status
        };

        console.log('📤 Sending payload:', payload);

        const response = await fetch('http://localhost:5000/api/observations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        console.log('✅ Submission success:', data);

        // 2. Verify the status in the response or by fetching it back
        if (data.status === 'needs_review') {
            console.log('🎉 SUCCESS: Observation was correctly flagged as "needs_review"!');
        } else {
            console.log('⚠️ WARNING: Observation status is:', data.status);
            console.log('   Expected: "needs_review"');
        }

    } catch (error) {
        console.error('❌ Error testing flagging:', error);
    }
}

testPlantFlagging();
