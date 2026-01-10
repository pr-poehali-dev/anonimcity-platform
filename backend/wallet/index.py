import json
import os
import psycopg2
from datetime import datetime
from decimal import Decimal
import requests

def handler(event: dict, context) -> dict:
    '''API для управления кошельком: получение баланса, курсов, пополнение'''
    
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
        # Используем публичное API CoinGecko для получения курсов
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
            # Fallback курсы если API недоступен
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
        # Возвращаем fallback курсы
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
    '''Получить баланс кошелька пользователя'''
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
    
    # Получаем кошелек
    cur.execute('''
        SELECT balance_rub, created_at, updated_at
        FROM t_p8292906_anonimcity_platform.wallets
        WHERE user_id = %s
    ''', (user_id,))
    
    row = cur.fetchone()
    
    # Создаем кошелек, если не существует
    if not row:
        cur.execute('''
            INSERT INTO t_p8292906_anonimcity_platform.wallets (user_id, balance_rub)
            VALUES (%s, 0.00)
            RETURNING balance_rub, created_at, updated_at
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
    
    conn.commit()
    
    wallet = {
        'balance_rub': float(row[0]),
        'created_at': row[1].isoformat() if row[1] else None,
        'updated_at': row[2].isoformat() if row[2] else None
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(wallet),
        'isBase64Encoded': False
    }


def get_transactions(method, event, cur, conn):
    '''Получить историю транзакций пользователя'''
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
        SELECT id, type, amount_crypto, crypto_currency, amount_rub, 
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
            'exchange_rate': float(row[5]) if row[5] else None,
            'description': row[6],
            'status': row[7],
            'created_at': row[8].isoformat() if row[8] else None,
            'completed_at': row[9].isoformat() if row[9] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(transactions),
        'isBase64Encoded': False
    }


def handle_deposit(method, event, cur, conn):
    '''Обработка пополнения баланса'''
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
    
    # Получаем актуальный курс
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
    
    # Конвертируем криптовалюту в рубли
    amount_rub = Decimal(str(amount_crypto)) * Decimal(str(exchange_rate))
    
    # Создаем транзакцию
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
    
    # Обновляем баланс кошелька
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