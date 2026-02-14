-- Insert Users
INSERT INTO users (email, password_hash, name, role) VALUES 
('citizen@example.com', 'password123', 'Maria Citizen', 'citizen'),
('researcher@example.com', 'password123', 'Dr. Research', 'researcher')
ON CONFLICT (email) DO NOTHING;

-- Insert Projects (Ensure ID 1 exists)
INSERT INTO projects (id, title, description, status) VALUES 
(1, 'River Health Survey 2025', 'Monitoring water quality in local rivers.', 'active'),
(2, 'Urban Tree Inventory', 'Mapping tree species in the city.', 'active')
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description;

-- Reset sequence for projects table so next insert doesn't conflict
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));
