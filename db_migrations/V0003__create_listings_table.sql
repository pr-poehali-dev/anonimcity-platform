-- Таблица для объявлений
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p8292906_anonimcity_platform.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'RUB',
    location VARCHAR(255),
    images TEXT[], -- массив URL изображений
    status VARCHAR(50) DEFAULT 'active', -- active, sold, hidden
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listings_user ON t_p8292906_anonimcity_platform.listings(user_id);
CREATE INDEX idx_listings_category ON t_p8292906_anonimcity_platform.listings(category);
CREATE INDEX idx_listings_status ON t_p8292906_anonimcity_platform.listings(status);
CREATE INDEX idx_listings_created_at ON t_p8292906_anonimcity_platform.listings(created_at DESC);