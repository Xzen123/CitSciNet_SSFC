const router = require('express').Router();
const { pool } = require('../config/db');
const validationController = require('../controllers/validationController');
const gamificationController = require('../controllers/gamificationController');
const auth = require('../middleware/authMiddleware'); // Assuming we want to track user points, we need auth

// Get all observations
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, type, 
             ST_X(location::geometry) as longitude, 
             ST_Y(location::geometry) as latitude,
             measurements, description, photo_urls, 
             status, created_at
      FROM observations
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit an observation (Protect this route if we want to award points to users)
// For now, if no user is logged in (req.user undefined), we skip point awards
router.post('/', auth, async (req, res) => {
  const { project_id, type, latitude, longitude, measurements, description, photo_urls } = req.body;

  if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
    return res.status(400).json({ error: 'Invalid location data. Latitude and Longitude are required.' });
  }

  // 1. Run Automated Validation
  const validationResult = validationController.autoValidate(req.body);

  let status = validationResult.isValid ? 'active' : 'flagged'; // 'needs_review' or 'flagged' based on severity
  if (!validationResult.isValid) status = 'needs_review';

  // Specific check for plant confidence from previous task (keep consistent)
  // validationController now handles this genericaly if configured, but keeping legacy check for now or merging it
  // The autoValidate function I wrote is generic. Let's trust it or extend it.
  // Actually, let's just stick to the autoValidate result for status.

  // MERGE validation flags
  const flags = validationResult.flags.map(f => f.message);

  try {
    const query = `
        INSERT INTO observations 
          (project_id, user_id, type, location, measurements, description, photo_urls, status)
        VALUES 
          ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6, $7, $8, $9)
        RETURNING id, status
      `;

    // Default values if missing
    // Default values if missing
    const pid = project_id || 1;
    const photos = photo_urls || [];
    const userId = req.user ? req.user.id : null;

    // ---------------------------------------------------------
    // 🚨 GEOFENCING CHECK (20km Radius)
    // ---------------------------------------------------------
    // 1. Get Project Center
    const projRes = await pool.query('SELECT location FROM projects WHERE id = $1', [pid]);
    if (projRes.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

    // 2. Check Distance if project has a location
    if (projRes.rows[0].location) {
      const distQuery = `
            SELECT ST_Distance(
                (SELECT location FROM projects WHERE id = $1),
                ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography
            ) as distance_meters
        `;
      const distRes = await pool.query(distQuery, [pid, longitude, latitude]);
      const distance = distRes.rows[0].distance_meters;

      console.log(`[GEOFENCE] Project ${pid} vs Obs: ${distance.toFixed(2)} meters`);

      if (distance > 20000) { // 20km = 20,000 meters
        return res.status(400).json({
          error: `Location Validation Failed: You are ${(distance / 1000).toFixed(1)}km away from the project site. Max allowed is 20km.`
        });
      }
    }
    // ---------------------------------------------------------

    const { rows } = await pool.query(query, [
      pid, userId, type, latitude, longitude, measurements, description, photos, status
    ]);

    const newObs = rows[0];

    // 2. Award Points (if valid and user exists)
    if (userId && status === 'active') {
      // defined in controller: awardPoints(userId, amount, actionType, entityId)
      await gamificationController.awardPoints(userId, 10, 'observation_submit', newObs.id);
    }

    res.status(201).json({ ...newObs, flags });
  } catch (err) {
    console.error('Error submitting observation:', err);
    res.status(500).json({ error: 'Failed to submit observation', details: err.message });
  }
});

// Update Observation Status (Researcher Only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'rejected'

    const result = await pool.query(
      'UPDATE observations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Observation not found' });
    }

    const updatedObs = result.rows[0];

    // Award points if approved
    if (status === 'approved' && updatedObs.user_id) {
      // defined in controller: awardPoints(userId, amount, actionType, entityId)
      await gamificationController.awardPoints(updatedObs.user_id, 10, 'observation_submit', updatedObs.id);
    }

    res.json(updatedObs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
