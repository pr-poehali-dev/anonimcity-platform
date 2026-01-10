-- Расширяем таблицу model_applications для хранения полных анкет моделей
ALTER TABLE t_p8292906_anonimcity_platform.model_applications 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(255),
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS video_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS audio_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS chat_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Обновляем индекс для быстрого поиска по нику
CREATE INDEX IF NOT EXISTS idx_applications_nickname ON t_p8292906_anonimcity_platform.model_applications(nickname);