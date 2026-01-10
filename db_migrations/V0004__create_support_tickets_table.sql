-- Таблица для обращений в поддержку
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.support_tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p8292906_anonimcity_platform.users(id),
    user_login VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_support_tickets_user ON t_p8292906_anonimcity_platform.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON t_p8292906_anonimcity_platform.support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON t_p8292906_anonimcity_platform.support_tickets(created_at DESC);