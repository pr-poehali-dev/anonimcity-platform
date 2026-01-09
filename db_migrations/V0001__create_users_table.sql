-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE
);

-- Создание индекса для быстрого поиска по логину
CREATE INDEX idx_users_login ON t_p8292906_anonimcity_platform.users(login);

-- Комментарии к таблице и полям
COMMENT ON TABLE t_p8292906_anonimcity_platform.users IS 'Таблица анонимных пользователей платформы';
COMMENT ON COLUMN t_p8292906_anonimcity_platform.users.login IS 'Уникальный логин пользователя (anon_xxxxxxxx)';
COMMENT ON COLUMN t_p8292906_anonimcity_platform.users.password IS 'Пароль пользователя (хранится в открытом виде для анонимности)';
COMMENT ON COLUMN t_p8292906_anonimcity_platform.users.created_at IS 'Дата и время создания аккаунта';
COMMENT ON COLUMN t_p8292906_anonimcity_platform.users.last_login IS 'Дата и время последнего входа';
COMMENT ON COLUMN t_p8292906_anonimcity_platform.users.two_factor_enabled IS 'Включена ли двухфакторная аутентификация';