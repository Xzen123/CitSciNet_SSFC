-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          VARCHAR(20) DEFAULT 'citizen',  -- 'citizen', 'researcher', 'educator'
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  short_description VARCHAR(150),
  category      VARCHAR(50),
  image_url     TEXT,
  researcher_id INTEGER REFERENCES users(id),
  protocols     JSONB,          -- Stores the step-by-step protocol definitions
  status        VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'archived'
  study_area    GEOMETRY(POLYGON, 4326),  -- Geographic boundary of the project
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Observations table (the core table)
CREATE TABLE IF NOT EXISTS observations (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  project_id    INTEGER REFERENCES projects(id),
  type          VARCHAR(50) NOT NULL,  -- 'water_quality', 'wildlife', etc.
  location      GEOMETRY(POINT, 4326) NOT NULL,  -- The GPS point
  measurements  JSONB,          -- Flexible: {"pH": 7.2, "temp": 18, "turbidity": "clear"}
  description   TEXT,
  photo_urls    TEXT[],         -- Array of photo URLs
  status        VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'flagged', 'rejected'
  flags         JSONB,          -- QA warnings: [{"type": "range", "message": "Unusual pH"}]
  reviewed_by   INTEGER REFERENCES users(id),
  reviewed_at   TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Spatial index for fast geographic queries
CREATE INDEX IF NOT EXISTS idx_observations_location 
  ON observations USING GIST (location);

-- Index for filtering by project and status
CREATE INDEX IF NOT EXISTS idx_observations_project_status 
  ON observations (project_id, status);

-- GAMIFICATION TABLES --

-- Point Transactions
CREATE TABLE IF NOT EXISTS user_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'observation_submit', 'validation_vote', 'streak_bonus'
    related_entity_id INTEGER, -- observation_id or badge_id
    created_at TIMESTAMP DEFAULT NOW()
);

-- Badges Definitions
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    category VARCHAR(50), -- 'Accuracy', 'Exploration', 'Community'
    criteria JSONB -- {"min_observations": 10, "min_accuracy": 0.95}
);

-- User Badges (Unlocked)
CREATE TABLE IF NOT EXISTS user_badges (
    user_id INTEGER REFERENCES users(id),
    badge_id INTEGER REFERENCES badges(id),
    awarded_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- User Levels (Cached for performance)
CREATE TABLE IF NOT EXISTS user_levels (
    user_id INTEGER REFERENCES users(id) PRIMARY KEY,
    current_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    accuracy_score FLOAT DEFAULT 0.0, -- Dynamic reputation score
    streak_days INTEGER DEFAULT 0,
    last_active TIMESTAMP
);

-- VALIDATION TABLES --

-- Validation Rules Configuration
CREATE TABLE IF NOT EXISTS validation_rules (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    observation_type VARCHAR(50), 
    rules JSONB -- {"min_ph": 0, "max_ph": 14, "required_fields": ["photo"]}
);

-- Peer Reviews
CREATE TABLE IF NOT EXISTS observation_reviews (
    id SERIAL PRIMARY KEY,
    observation_id INTEGER REFERENCES observations(id),
    reviewer_id INTEGER REFERENCES users(id),
    status VARCHAR(20), -- 'approved', 'rejected', 'unsure'
    comments TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(observation_id, reviewer_id) -- One review per user per observation
);

-- Validation Flags / Audit Trail
CREATE TABLE IF NOT EXISTS validation_flags (
    id SERIAL PRIMARY KEY,
    observation_id INTEGER REFERENCES observations(id),
    flag_type VARCHAR(50), -- 'gps_spoof', 'out_of_range', 'usage_limit'
    severity VARCHAR(20), -- 'warning', 'critical'
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
