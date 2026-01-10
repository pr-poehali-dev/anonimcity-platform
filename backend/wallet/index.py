import json
import os
import psycopg2
from datetime import datetime, timedelta
from decimal import Decimal
import requests

def handler(event: dict, context) -> dict:
    '''API для управления кошельком: баланс, обмен RUB/CITY, стейкинг'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        query_params = event.get('queryStringParameters') or {}
        action = query_params.get('action', 'balance')
        
        if action == 'rates':
            return get_exchange_rates(cur, conn)
        elif action == 'balance':
            return get_wallet_balance(method, event, cur, conn)
        elif action == 'transactions':
            return get_transactions(method, event, cur, conn)
        elif action == 'deposit':
            return handle_deposit(method, event, cur, conn)
        elif action == 'exchange':
            return handle_exchange(method, event, cur, conn)
        elif action == 'staking':
            return handle_staking(method, event, cur, conn)
        elif action == 'staking_list':
            return get_staking_list(method, event, cur, conn)
        elif action == 'claim_rewards':
            return claim_staking_rewards(method, event, cur, conn)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()


def get_exchange_rates(cur, conn):
    '''Получить актуальные курсы криптовалют к рублю'''
    try:
        response = requests.get(
            'https://api.coingecko.com/api/v3/simple/price',
            params={
                'ids': 'bitcoin,ethereum,tether',
                'vs_currencies': 'rub'
            },
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            rates = {
                'BTC': float(data.get('bitcoin', {}).get('rub', 0)),
                'ETH': float(data.get('ethereum', {}).get('rub', 0)),
                'USDT': float(data.get('tether', {}).get('rub', 0)),
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'rates': rates, 'updated_at': datetime.now().isoformat()}),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'rates': {'BTC': 6000000, 'ETH': 250000, 'USDT': 95},
                    'updated_at': datetime.now().isoformat(),
                    'fallback': True
                }),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'rates': {'BTC': 6000000, 'ETH': 250000, 'USDT': 95},
                'updated_at': datetime.now().isoformat(),
                'fallback': True
            }),
            'isBase64Encoded': False
        }


def get_wallet_balance(method, event, cur, conn):
    '''Получить баланс кошелька (RUB и CITY)'''
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        SELECT balance_rub, balance_city, created_at, updated_at
        FROM t_p8292906_anonimcity_platform.wallets
        WHERE user_id = %s
    ''', (user_id,))
    
    row = cur.fetchone()
    
    if not row:
        cur.execute('''
            INSERT INTO t_p8292906_anonimcity_platform.wallets (user_id, balance_rub, balance_city)
            VALUES (%s, 0.00, 0.00)
            RETURNING balance_rub, balance_city, created_at, updated_at
        ''', (user_id,))
        row = cur.fetchone()
        conn.commit()
    
    if not row:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Wallet not found'}),
            'isBase64Encoded': False
        }
    
    wallet = {
        'balance_rub': float(row[0]),
        'balance_city': float(row[1]),
        'created_at': row[2].isoformat() if row[2] else None,
        'updated_at': row[3].isoformat() if row[3] else None
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(wallet),
        'isBase64Encoded': False
    }


def get_transactions(method, event, cur, conn):
    '''Получить историю транзакций'''
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        SELECT id, type, amount_crypto, crypto_currency, amount_rub, amount_city,
               exchange_rate, description, status, created_at, completed_at
        FROM t_p8292906_anonimcity_platform.transactions
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 100
    ''', (user_id,))
    
    transactions = []
    for row in cur.fetchall():
        transactions.append({
            'id': row[0],
            'type': row[1],
            'amount_crypto': float(row[2]) if row[2] else None,
            'crypto_currency': row[3],
            'amount_rub': float(row[4]),
            'amount_city': float(row[5]) if row[5] else None,
            'exchange_rate': float(row[6]) if row[6] else None,
            'description': row[7],
            'status': row[8],
            'created_at': row[9].isoformat() if row[9] else None,
            'completed_at': row[10].isoformat() if row[10] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(transactions),
        'isBase64Encoded': False
    }


def handle_deposit(method, event, cur, conn):
    '''Пополнение баланса криптовалютой'''
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    amount_crypto = body.get('amount_crypto')
    crypto_currency = body.get('crypto_currency', 'BTC')
    
    if not amount_crypto or float(amount_crypto) <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid amount'}),
            'isBase64Encoded': False
        }
    
    rates_response = get_exchange_rates(cur, conn)
    rates_data = json.loads(rates_response['body'])
    exchange_rate = rates_data['rates'].get(crypto_currency, 0)
    
    if exchange_rate <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid currency or rate unavailable'}),
            'isBase64Encoded': False
        }
    
    amount_rub = Decimal(str(amount_crypto)) * Decimal(str(exchange_rate))
    
    cur.execute('''
        INSERT INTO t_p8292906_anonimcity_platform.transactions 
        (user_id, type, amount_crypto, crypto_currency, amount_rub, exchange_rate, description, status, completed_at)
        VALUES (%s, 'deposit', %s, %s, %s, %s, %s, 'completed', %s)
        RETURNING id
    ''', (
        user_id,
        amount_crypto,
        crypto_currency,
        float(amount_rub),
        exchange_rate,
        f'Пополнение {amount_crypto} {crypto_currency}',
        datetime.now()
    ))
    
    transaction_id = cur.fetchone()[0]
    
    cur.execute('''
        UPDATE t_p8292906_anonimcity_platform.wallets
        SET balance_rub = balance_rub + %s,
            updated_at = %s
        WHERE user_id = %s
    ''', (float(amount_rub), datetime.now(), user_id))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'transaction_id': transaction_id,
            'amount_crypto': float(amount_crypto),
            'crypto_currency': crypto_currency,
            'amount_rub': float(amount_rub),
            'exchange_rate': exchange_rate
        }),
        'isBase64Encoded': False
    }


def handle_exchange(method, event, cur, conn):
    '''Обмен RUB <-> CITY (1 CITY = 1 RUB)'''
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    from_currency = body.get('from_currency')
    amount = body.get('amount')
    
    if not from_currency or not amount or float(amount) <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid parameters'}),
            'isBase64Encoded': False
        }
    
    amount_decimal = Decimal(str(amount))
    
    cur.execute('''
        SELECT balance_rub, balance_city
        FROM t_p8292906_anonimcity_platform.wallets
        WHERE user_id = %s
    ''', (user_id,))
    
    row = cur.fetchone()
    if not row:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Wallet not found'}),
            'isBase64Encoded': False
        }
    
    balance_rub, balance_city = Decimal(str(row[0])), Decimal(str(row[1]))
    
    if from_currency == 'RUB':
        if balance_rub < amount_decimal:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Insufficient RUB balance'}),
                'isBase64Encoded': False
            }
        
        new_balance_rub = balance_rub - amount_decimal
        new_balance_city = balance_city + amount_decimal
        description = f'Обмен {amount} RUB → CITY'
        
    elif from_currency == 'CITY':
        if balance_city < amount_decimal:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Insufficient CITY balance'}),
                'isBase64Encoded': False
            }
        
        new_balance_rub = balance_rub + amount_decimal
        new_balance_city = balance_city - amount_decimal
        description = f'Обмен {amount} CITY → RUB'
    else:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid currency'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        UPDATE t_p8292906_anonimcity_platform.wallets
        SET balance_rub = %s,
            balance_city = %s,
            updated_at = %s
        WHERE user_id = %s
    ''', (float(new_balance_rub), float(new_balance_city), datetime.now(), user_id))
    
    cur.execute('''
        INSERT INTO t_p8292906_anonimcity_platform.transactions 
        (user_id, type, amount_rub, amount_city, description, status, completed_at)
        VALUES (%s, 'exchange', %s, %s, %s, 'completed', %s)
        RETURNING id
    ''', (user_id, float(amount_decimal), float(amount_decimal), description, datetime.now()))
    
    transaction_id = cur.fetchone()[0]
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'transaction_id': transaction_id,
            'new_balance_rub': float(new_balance_rub),
            'new_balance_city': float(new_balance_city)
        }),
        'isBase64Encoded': False
    }


def handle_staking(method, event, cur, conn):
    '''Создание стейкинга'''
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    amount_city = body.get('amount_city')
    period_months = body.get('period_months')
    
    if not amount_city or float(amount_city) <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid amount'}),
            'isBase64Encoded': False
        }
    
    rate_map = {1: 30, 3: 40, 6: 50, 12: 60}
    if period_months not in rate_map:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid period (must be 1, 3, 6, or 12 months)'}),
            'isBase64Encoded': False
        }
    
    annual_rate = rate_map[period_months]
    amount_decimal = Decimal(str(amount_city))
    
    cur.execute('''
        SELECT balance_city
        FROM t_p8292906_anonimcity_platform.wallets
        WHERE user_id = %s
    ''', (user_id,))
    
    row = cur.fetchone()
    if not row or Decimal(str(row[0])) < amount_decimal:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Insufficient CITY balance'}),
            'isBase64Encoded': False
        }
    
    start_date = datetime.now()
    end_date = start_date + timedelta(days=period_months * 30)
    
    cur.execute('''
        INSERT INTO t_p8292906_anonimcity_platform.staking 
        (user_id, amount_city, period_months, annual_rate, start_date, end_date, last_reward_date, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'active')
        RETURNING id
    ''', (user_id, float(amount_decimal), period_months, annual_rate, start_date, end_date, start_date))
    
    staking_id = cur.fetchone()[0]
    
    cur.execute('''
        UPDATE t_p8292906_anonimcity_platform.wallets
        SET balance_city = balance_city - %s,
            updated_at = %s
        WHERE user_id = %s
    ''', (float(amount_decimal), datetime.now(), user_id))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'staking_id': staking_id,
            'amount_city': float(amount_decimal),
            'period_months': period_months,
            'annual_rate': annual_rate,
            'end_date': end_date.isoformat()
        }),
        'isBase64Encoded': False
    }


def get_staking_list(method, event, cur, conn):
    '''Получить список стейкингов пользователя с начислением процентов'''
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    process_daily_rewards(cur, conn, user_id)
    
    cur.execute('''
        SELECT id, amount_city, period_months, annual_rate, start_date, end_date,
               last_reward_date, total_earned, status, created_at
        FROM t_p8292906_anonimcity_platform.staking
        WHERE user_id = %s
        ORDER BY created_at DESC
    ''', (user_id,))
    
    stakings = []
    for row in cur.fetchall():
        stakings.append({
            'id': row[0],
            'amount_city': float(row[1]),
            'period_months': row[2],
            'annual_rate': float(row[3]),
            'start_date': row[4].isoformat() if row[4] else None,
            'end_date': row[5].isoformat() if row[5] else None,
            'last_reward_date': row[6].isoformat() if row[6] else None,
            'total_earned': float(row[7]),
            'status': row[8],
            'created_at': row[9].isoformat() if row[9] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(stakings),
        'isBase64Encoded': False
    }


def process_daily_rewards(cur, conn, user_id):
    '''Начислить ежедневные проценты по всем активным стейкингам'''
    cur.execute('''
        SELECT id, amount_city, annual_rate, last_reward_date, end_date
        FROM t_p8292906_anonimcity_platform.staking
        WHERE user_id = %s AND status = 'active'
    ''', (user_id,))
    
    now = datetime.now()
    
    for row in cur.fetchall():
        staking_id, amount, annual_rate, last_reward_date, end_date = row
        
        if now > end_date:
            cur.execute('''
                UPDATE t_p8292906_anonimcity_platform.staking
                SET status = 'completed'
                WHERE id = %s
            ''', (staking_id,))
            
            cur.execute('''
                SELECT COALESCE(SUM(amount_city), 0) + %s
                FROM t_p8292906_anonimcity_platform.staking_rewards
                WHERE staking_id = %s
            ''', (amount, staking_id))
            
            total_return = cur.fetchone()[0]
            
            cur.execute('''
                UPDATE t_p8292906_anonimcity_platform.wallets
                SET balance_city = balance_city + %s,
                    updated_at = %s
                WHERE user_id = %s
            ''', (float(total_return), now, user_id))
            
            continue
        
        days_passed = (now - last_reward_date).days
        
        if days_passed >= 1:
            daily_rate = Decimal(str(annual_rate)) / Decimal('365')
            amount_decimal = Decimal(str(amount))
            daily_reward = amount_decimal * daily_rate / Decimal('100')
            total_reward = daily_reward * Decimal(str(days_passed))
            
            for _ in range(days_passed):
                cur.execute('''
                    INSERT INTO t_p8292906_anonimcity_platform.staking_rewards
                    (staking_id, amount_city, reward_date)
                    VALUES (%s, %s, %s)
                ''', (staking_id, float(daily_reward), now))
            
            cur.execute('''
                UPDATE t_p8292906_anonimcity_platform.staking
                SET last_reward_date = %s,
                    total_earned = total_earned + %s
                WHERE id = %s
            ''', (now, float(total_reward), staking_id))
    
    conn.commit()


def claim_staking_rewards(method, event, cur, conn):
    '''Забрать награды со стейкинга досрочно (без основной суммы)'''
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    staking_id = body.get('staking_id')
    
    if not staking_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Staking ID required'}),
            'isBase64Encoded': False
        }
    
    process_daily_rewards(cur, conn, user_id)
    
    cur.execute('''
        SELECT total_earned, status
        FROM t_p8292906_anonimcity_platform.staking
        WHERE id = %s AND user_id = %s
    ''', (staking_id, user_id))
    
    row = cur.fetchone()
    if not row:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Staking not found'}),
            'isBase64Encoded': False
        }
    
    total_earned, status = row
    
    if status != 'active':
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Staking is not active'}),
            'isBase64Encoded': False
        }
    
    if total_earned <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No rewards to claim'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        UPDATE t_p8292906_anonimcity_platform.wallets
        SET balance_city = balance_city + %s,
            updated_at = %s
        WHERE user_id = %s
    ''', (total_earned, datetime.now(), user_id))
    
    cur.execute('''
        UPDATE t_p8292906_anonimcity_platform.staking
        SET total_earned = 0
        WHERE id = %s
    ''', (staking_id,))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'claimed_amount': float(total_earned)
        }),
        'isBase64Encoded': False
    }
