-- Таблица кошельков пользователей
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  balance_rub DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES t_p8292906_anonimcity_platform.users(id)
);

-- Таблица транзакций
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  amount_crypto DECIMAL(18,8),
  crypto_currency VARCHAR(10),
  amount_rub DECIMAL(15,2) NOT NULL,
  exchange_rate DECIMAL(18,2),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES t_p8292906_anonimcity_platform.users(id)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON t_p8292906_anonimcity_platform.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON t_p8292906_anonimcity_platform.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON t_p8292906_anonimcity_platform.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON t_p8292906_anonimcity_platform.transactions(created_at DESC);

-- Создание кошельков для существующих пользователей
INSERT INTO t_p8292906_anonimcity_platform.wallets (user_id, balance_rub)
SELECT id, 0.00
FROM t_p8292906_anonimcity_platform.users
WHERE NOT EXISTS (
  SELECT 1 FROM t_p8292906_anonimcity_platform.wallets WHERE wallets.user_id = users.id
);