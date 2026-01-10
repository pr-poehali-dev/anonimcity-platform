-- Таблица для сообщений между пользователями
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES t_p8292906_anonimcity_platform.users(id),
    receiver_id INTEGER NOT NULL REFERENCES t_p8292906_anonimcity_platform.users(id),
    subject VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_receiver ON t_p8292906_anonimcity_platform.messages(receiver_id);
CREATE INDEX idx_messages_sender ON t_p8292906_anonimcity_platform.messages(sender_id);
CREATE INDEX idx_messages_created_at ON t_p8292906_anonimcity_platform.messages(created_at DESC);