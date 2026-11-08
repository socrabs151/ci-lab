ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

INSERT INTO users (email, name)
VALUES ('anna@example.com', 'Анна'), ('ivan@example.com', 'Иван')
ON CONFLICT (email) DO NOTHING;
