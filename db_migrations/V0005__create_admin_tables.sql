-- Таблица категорий
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица моделей
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  age INTEGER,
  location VARCHAR(255),
  rating DECIMAL(3,2),
  reviews INTEGER DEFAULT 0,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заявок моделей
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.model_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  city VARCHAR(255),
  telegram VARCHAR(255),
  experience TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- Таблица анонимных писем
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.anonymous_letters (
  id SERIAL PRIMARY KEY,
  sender_login VARCHAR(255),
  recipient_login VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_models_status ON t_p8292906_anonimcity_platform.models(status);
CREATE INDEX IF NOT EXISTS idx_applications_status ON t_p8292906_anonimcity_platform.model_applications(status);
CREATE INDEX IF NOT EXISTS idx_letters_recipient ON t_p8292906_anonimcity_platform.anonymous_letters(recipient_login);