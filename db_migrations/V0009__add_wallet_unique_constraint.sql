-- Добавляем уникальный индекс на user_id для поддержки ON CONFLICT
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallets_user_id_unique 
ON t_p8292906_anonimcity_platform.wallets(user_id);
