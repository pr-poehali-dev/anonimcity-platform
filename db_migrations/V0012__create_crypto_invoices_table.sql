-- Таблица для хранения криптовалютных счетов
CREATE TABLE IF NOT EXISTS t_p8292906_anonimcity_platform.crypto_invoices (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    listing_id INTEGER,
    crypto_currency VARCHAR(10) NOT NULL,
    amount_crypto DECIMAL(18, 8) NOT NULL,
    amount_rub DECIMAL(10, 2) NOT NULL,
    exchange_rate DECIMAL(18, 2) NOT NULL,
    payment_address VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    tx_hash VARCHAR(255)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_crypto_invoices_user_id ON t_p8292906_anonimcity_platform.crypto_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_invoices_invoice_id ON t_p8292906_anonimcity_platform.crypto_invoices(invoice_id);
CREATE INDEX IF NOT EXISTS idx_crypto_invoices_status ON t_p8292906_anonimcity_platform.crypto_invoices(status);
CREATE INDEX IF NOT EXISTS idx_crypto_invoices_listing_id ON t_p8292906_anonimcity_platform.crypto_invoices(listing_id);

COMMENT ON TABLE t_p8292906_anonimcity_platform.crypto_invoices IS 'Счета для оплаты криптовалютой';
COMMENT ON COLUMN t_p8292906_anonimcity_platform.crypto_invoices.invoice_id IS 'Уникальный ID счета';
COMMENT ON COLUMN t_p8292906_anonimcity_platform.crypto_invoices.status IS 'Статус: pending, paid, confirmed, expired';
