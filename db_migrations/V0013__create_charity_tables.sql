-- Создание таблицы благотворительных проектов
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.charity_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    goal DECIMAL(12, 2) NOT NULL,
    raised DECIMAL(12, 2) DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(50) DEFAULT '❤️',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы пожертвований
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.charity_donations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p8292906_anonimcity_platform.users(id),
    project_id INTEGER REFERENCES t_p8292906_anonimcity_platform.charity_projects(id),
    amount DECIMAL(12, 2) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_charity_donations_user_id ON t_p8292906_anonimcity_platform.charity_donations(user_id);
CREATE INDEX IF NOT EXISTS idx_charity_donations_project_id ON t_p8292906_anonimcity_platform.charity_donations(project_id);
CREATE INDEX IF NOT EXISTS idx_charity_projects_status ON t_p8292906_anonimcity_platform.charity_projects(status);