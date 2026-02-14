const { pool } = require('../config/db');

// Automated Validation Logic
exports.autoValidate = (observation) => {
    const flags = [];
    let integrityScore = 100;
    const { type, measurements, latitude, longitude } = observation;

    // 1. Range Checks & Logic
    if (measurements) {
        switch (type) {
            case 'water_quality':
                const ph = parseFloat(measurements.ph);
                if (ph < 0 || ph > 14) {
                    flags.push({ type: 'range_error', message: 'pH out of range (0-14)' });
                    integrityScore -= 50;
                }
                const temp = parseFloat(measurements.temperature);
                if (temp < -50 || temp > 60) {
                    flags.push({ type: 'range_error', message: 'Temperature out of realistic range (-50 to 60°C)' });
                    integrityScore -= 30;
                }
                break;

            case 'air_quality':
                const aqi = parseFloat(measurements.aqi);
                if (aqi < 0 || aqi > 500) {
                    flags.push({ type: 'range_error', message: 'AQI out of range (0-500)' });
                    integrityScore -= 40;
                }
                const pm25 = parseFloat(measurements.pm25);
                if (pm25 < 0) {
                    flags.push({ type: 'range_error', message: 'PM2.5 cannot be negative' });
                    integrityScore -= 40;
                }
                break;

            case 'wildlife':
                const count = parseInt(measurements.count);
                if (count <= 0) {
                    flags.push({ type: 'logic_error', message: 'Count must be at least 1' });
                    integrityScore -= 20;
                }
                if (!measurements.species_name || measurements.species_name.length < 2) {
                    flags.push({ type: 'missing_data', message: 'Species name is too short or missing' });
                    integrityScore -= 20;
                }
                break;

            case 'plant':
                const height = parseFloat(measurements.height);
                if (height < 0) {
                    flags.push({ type: 'logic_error', message: 'Height cannot be negative' });
                    integrityScore -= 20;
                }
                break;
        }
    }

    // 2. Location Checks (Simple coordinate validity)
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (lat === 0 && lon === 0) {
        flags.push({ type: 'location_suspicious', message: 'Null Island coordinates (0,0)' });
        integrityScore -= 30;
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        flags.push({ type: 'location_invalid', message: 'Coordinates out of valid range' });
        integrityScore = 0; // Invalid
    }

    return { isValid: integrityScore > 80, flags, integrityScore };
};

// Submit Peer Review
exports.submitReview = async (req, res) => {
    try {
        const { observationId, status, comments } = req.body;
        const reviewerId = req.user.id;

        // Insert Review
        await pool.query(
            `INSERT INTO observation_reviews (observation_id, reviewer_id, status, comments) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (observation_id, reviewer_id) DO UPDATE 
             SET status = $3, comments = $4`,
            [observationId, reviewerId, status, comments]
        );

        // Check Consensus (Simplified: 2 approvals = verify)
        const reviewsRes = await pool.query(
            'SELECT status, count(*) FROM observation_reviews WHERE observation_id = $1 GROUP BY status',
            [observationId]
        );

        const approvalCount = reviewsRes.rows.find(r => r.status === 'approved')?.count || 0;

        if (parseInt(approvalCount) >= 2) {
            await pool.query('UPDATE observations SET status = $1 WHERE id = $2', ['verified', observationId]);
            // Trigger Gamification Point Award for Author (handled in hook or separately)
        }

        res.json({ message: 'Review submitted', approvalCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get Pending Validations
exports.getPending = async (req, res) => {
    try {
        // Get observations needing review (status = pending or needs_review)
        // Exclude own observations
        const query = `
            SELECT o.*, u.name as author_name 
            FROM observations o
            JOIN users u ON o.user_id = u.id
            WHERE o.status IN ('pending', 'needs_review')
            AND o.user_id != $1
            LIMIT 10
        `;
        const { rows } = await pool.query(query, [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
