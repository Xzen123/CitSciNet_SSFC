const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

const USERS = [
    { name: 'Dr. Aditi Sharma', email: 'aditi@research.in', role: 'researcher', password: 'password123' },
    { name: 'Rahul Verma', email: 'rahul@citizen.in', role: 'citizen', password: 'password123' },
    { name: 'Priya Patel', email: 'priya@citizen.in', role: 'citizen', password: 'password123' },
    { name: 'Vikram Singh', email: 'vikram@school.edu', role: 'educator', password: 'password123' },
    { name: 'Anjali Gupta', email: 'anjali@nature.org', role: 'citizen', password: 'password123' },
    { name: 'Rohan Das', email: 'rohan@mountains.org', role: 'citizen', password: 'password123' },
    { name: 'Nishant', email: 'nishant999908@gmail.com', role: 'researcher', password: '2005' }
];

// ... (rest of the file until flagged observation)


const PROJECTS = [
    {
        title: 'Ganges River Watch',
        description: 'Monitoring water quality along the Ganges river basin to track pollution levels and aquatic health.',
        short_description: 'Track pollution in the Ganges.',
        category: 'Water',
        image_url: 'https://images.unsplash.com/photo-1596423737527-31952d9b62f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        center_lat: 25.3176, // Varanasi
        center_lng: 82.9739,
        protocols: JSON.stringify({
            type: 'water_quality',
            fields: ['ph', 'temperature', 'dissolved_oxygen', 'turbidity']
        })
    },
    {
        title: 'Bengaluru Bird Count',
        description: 'Documenting bird diversity in the garden city to study urbanization effects.',
        short_description: 'Count birds in Bengaluru parks.',
        category: 'Wildlife',
        image_url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        center_lat: 12.9716,
        center_lng: 77.5946,
        protocols: JSON.stringify({
            type: 'wildlife',
            fields: ['species_name', 'count', 'behavior']
        })
    },
    {
        title: 'Delhi Air Monitor',
        description: 'Tracking PM2.5 and AQI levels across NCR neighborhoods during winter months.',
        short_description: 'Monitor Delhi air quality.',
        category: 'Air',
        image_url: 'https://images.unsplash.com/photo-1555979860-e7193d256877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        center_lat: 28.6139,
        center_lng: 77.2090,
        protocols: JSON.stringify({
            type: 'air_quality',
            fields: ['aqi', 'pm25']
        })
    },
    {
        title: 'Himalayan Waste Watch',
        description: 'Mapping waste hotspots in high-altitude trekking routes in Ladakh and Himachal.',
        short_description: 'Map waste in the Himalayas.',
        category: 'Land',
        image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Mountains
        center_lat: 34.1526, // Leh
        center_lng: 77.5770,
        protocols: JSON.stringify({
            type: 'waste_mapping', // Will use default grey icon
            fields: ['waste_type', 'estimated_weight_kg', 'status']
        })
    },
    {
        title: 'Mumbai Marine Life',
        description: 'Cataloging intertidal marine species along the Mumbai coastline.',
        short_description: 'Catalog marine life in Mumbai.',
        category: 'Wildlife',
        image_url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Sea/Crab
        center_lat: 18.9220,
        center_lng: 72.8347,
        protocols: JSON.stringify({
            type: 'wildlife',
            fields: ['species_name', 'count', 'habitat']
        })
    },
    {
        title: 'Rajasthan Desert Flora',
        description: 'Documenting native plant species in the Thar Desert to monitor desertification.',
        short_description: 'Survey plants in Thar Desert.',
        category: 'Plants',
        image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Desert
        center_lat: 26.9157, // Jaisalmer
        center_lng: 70.9083,
        protocols: JSON.stringify({
            type: 'plant',
            fields: ['species_name', 'height', 'flowering_status']
        })
    },
    {
        title: 'Chennai Coastal Cleanup',
        description: 'Monitoring plastic pollution levels on Chennai beaches.',
        short_description: 'Monitor beach pollution.',
        category: 'Water',
        image_url: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Beach
        center_lat: 13.0827,
        center_lng: 80.2707,
        protocols: JSON.stringify({
            type: 'water_quality',
            fields: ['pollution_level', 'plastic_type']
        })
    }
];

// Helper for random location with spread (degrees)
function randomLoc(centerLat, centerLng, spread = 0.1) {
    return {
        lat: centerLat + (Math.random() - 0.5) * spread,
        lng: centerLng + (Math.random() - 0.5) * spread
    };
}

async function seed() {
    try {
        console.log('🌱 Starting Expanded Seed Process (India Edition + Location)...');

        // 1. Clean existing data
        console.log('🗑️  Cleaning old data...');
        await pool.query('TRUNCATE user_points, observation_reviews, validation_flags, observations, projects, users CASCADE');

        // 2. Insert Users
        const userIds = [];
        for (const user of USERS) {
            const hash = await bcrypt.hash(user.password, 10);
            const res = await pool.query(
                `INSERT INTO users (name, email, password_hash, role) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING id`,
                [user.name, user.email, hash, user.role]
            );
            userIds.push(res.rows[0].id);
        }
        console.log(`✅ Seeded ${userIds.length} users`);

        // 3. Insert Projects
        const projectIds = [];
        const researcherId = userIds[0];

        for (const proj of PROJECTS) {
            const res = await pool.query(
                `INSERT INTO projects (title, description, short_description, category, image_url, researcher_id, protocols, location)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($9, $8), 4326))
                 RETURNING id`,
                [proj.title, proj.description, proj.short_description, proj.category, proj.image_url, researcherId, proj.protocols, proj.center_lat, proj.center_lng]
            );
            projectIds.push(res.rows[0].id);
        }
        console.log(`✅ Seeded ${projectIds.length} projects`);

        // 4. Insert Observations (Radius check: 0.1 deg is approx 11km, so these will be valid)
        const observations = [];
        let i = 0;
        for (const proj of PROJECTS) {
            const pid = projectIds[i++];
            // Create 8 valid observations per project
            for (let j = 0; j < 8; j++) {
                // Spread 0.15 deg ~ 16km spread max, likely within 20km radius from center
                const loc = randomLoc(proj.center_lat, proj.center_lng, 0.15);
                observations.push({
                    user_id: userIds[Math.floor(Math.random() * userIds.length)],
                    project_id: pid,
                    type: JSON.parse(proj.protocols).type,
                    latitude: loc.lat, longitude: loc.lng,
                    measurements: { sample: 'Simulated Data' },
                    status: 'active', description: 'Simulated valid location.'
                });
            }
        }

        // Flagged Item 1: Extreme Air Quality (Delhi)
        observations.push({
            user_id: userIds[1],
            project_id: projectIds[2],
            type: 'air_quality',
            latitude: 28.6139,
            longitude: 77.2090,
            measurements: { aqi: 1200, pm25: 999 },
            status: 'needs_review',
            description: 'Sensor error suspected.',
            flags: JSON.stringify([{ type: 'range_error', message: 'AQI extreme value (>500)' }])
        });

        // Flagged Item 2: Water pH Acidic (Ganges)
        observations.push({
            user_id: userIds[2],
            project_id: projectIds[0],
            type: 'water_quality',
            latitude: 25.3176,
            longitude: 82.9739,
            measurements: { ph: 2.5, temperature: 24 },
            status: 'needs_review',
            description: 'Water looks very strange here.',
            flags: JSON.stringify([{ type: 'range_error', message: 'pH dangerously low (<3.0)' }])
        });

        // Flagged Item 3: Suspicious Bird Count (Bengaluru)
        observations.push({
            user_id: userIds[1],
            project_id: projectIds[1],
            type: 'wildlife',
            latitude: 12.9716,
            longitude: 77.5946,
            measurements: { species_name: 'Tiger', count: 50 },
            status: 'needs_review',
            description: 'Saw many tigers in the park.',
            flags: JSON.stringify([{ type: 'validation_error', message: 'Unlikely species/count for urban area' }])
        });

        // Flagged Item 4: Location Mismatch (Mumbai -> Rajasthan Project)
        observations.push({
            user_id: userIds[2],
            project_id: projectIds[5],
            type: 'plant',
            latitude: 19.0760, // Mumbai
            longitude: 72.8777,
            measurements: { species_name: 'Cactus', height: 10 },
            status: 'flagged',
            description: 'Uploaded from Mumbai.',
            flags: JSON.stringify([{ type: 'geofence_error', message: 'Location 800km from project' }])
        });

        // Insert Observations
        for (const obs of observations) {
            const res = await pool.query(
                `INSERT INTO observations (user_id, project_id, type, location, measurements, status, description, flags)
                 VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6, $7, $8, $9)
                 RETURNING id`,
                [obs.user_id, obs.project_id, obs.type, obs.latitude, obs.longitude, obs.measurements, obs.status, obs.description, obs.flags]
            );

            if (obs.status === 'active') {
                await pool.query(
                    'INSERT INTO user_points (user_id, amount, action_type, related_entity_id) VALUES ($1, $2, $3, $4)',
                    [obs.user_id, 10, 'observation_submit', res.rows[0].id]
                );
            }
        }
        console.log(`✅ Seeded ${observations.length} observations`);

        // Update Levels
        for (const uid of userIds) {
            const xpResult = await pool.query('SELECT SUM(amount) as total FROM user_points WHERE user_id = $1', [uid]);
            const totalXP = parseInt(xpResult.rows[0].total) || 0;
            const level = Math.floor(Math.sqrt(totalXP) / 5) + 1;

            await pool.query(
                `INSERT INTO user_levels (user_id, current_xp, current_level, streak_days, last_active) 
                 VALUES ($1, $2, $3, $4, NOW())
                 ON CONFLICT (user_id) DO UPDATE SET current_xp = $2, current_level = $3`,
                [uid, totalXP, level, Math.floor(Math.random() * 5) + 1]
            );
        }
        console.log('✅ Updated Leaderboards');
        console.log('🎉 Expanded Seeding Complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
