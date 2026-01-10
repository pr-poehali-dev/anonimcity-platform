-- Добавляем баланс CITY в кошельки
ALTER TABLE t_p8292906_anonimcity_platform.wallets 
ADD COLUMN IF NOT EXISTS balance_city DECIMAL(15,2) DEFAULT 0.00;

-- Таблица стейкинга
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.staking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount_city DECIMAL(15,2) NOT NULL,
  period_months INTEGER NOT NULL CHECK (period_months IN (1, 3, 6, 12)),
  annual_rate DECIMAL(5,2) NOT NULL,
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NOT NULL,
  last_reward_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_earned DECIMAL(15,2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_staking_user FOREIGN KEY (user_id) REFERENCES t_p8292906_anonimcity_platform.users(id)
);

-- Таблица истории начислений стейкинга
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.staking_rewards (
  id SERIAL PRIMARY KEY,
  staking_id INTEGER NOT NULL,
  amount_city DECIMAL(15,2) NOT NULL,
  reward_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_staking_rewards FOREIGN KEY (staking_id) REFERENCES t_p8292906_anonimcity_platform.staking(id)
);

-- Обновляем таблицу транзакций для поддержки CITY
ALTER TABLE t_p8292906_anonimcity_platform.transactions 
ADD COLUMN IF NOT EXISTS amount_city DECIMAL(15,2);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_staking_user_id ON t_p8292906_anonimcity_platform.staking(user_id);
CREATE INDEX IF NOT EXISTS idx_staking_status ON t_p8292906_anonimcity_platform.staking(status);
CREATE INDEX IF NOT EXISTS idx_staking_end_date ON t_p8292906_anonimcity_platform.staking(end_date);
CREATE INDEX IF NOT EXISTS idx_staking_rewards_staking_id ON t_p8292906_anonimcity_platform.staking_rewards(staking_id);
