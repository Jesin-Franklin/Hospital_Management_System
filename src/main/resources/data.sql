-- Insert initial Admin user
-- Password is 'admin123'
INSERT INTO users (username, password, role, contact_info) 
SELECT 'admin', '$2a$10$x1k9D6XzL2/5Z/80s1p6dOV9/kO2u3CqO91x24s2fE93A/I4e.4X.', 'ADMIN', 'admin@hospital.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Insert a sample Receptionist
INSERT INTO users (username, password, role, contact_info) 
SELECT 'reception', '$2a$10$x1k9D6XzL2/5Z/80s1p6dOV9/kO2u3CqO91x24s2fE93A/I4e.4X.', 'RECEPTIONIST', 'reception@hospital.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'reception');
