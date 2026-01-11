import json
import os
import psycopg2
from datetime import datetime
import uuid

def handler(event: dict, context) -> dict:
    '''API для приема криптовалютных платежей за премиум объявления'''
    
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
        action = query_params.get('action', 'create_invoice')
        
        if action == 'create_invoice':
            return create_crypto_invoice(method, event, cur, conn)
        elif action == 'check_payment':
            return check_payment_status(method, event, cur, conn)
        elif action == 'get_address':
            return get_payment_address(method, event, cur, conn)
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


def create_crypto_invoice(method, event, cur, conn):
    '''Создать счет для оплаты криптовалютой'''
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
    
    data = json.loads(event.get('body', '{}'))
    crypto_currency = data.get('crypto_currency', 'BTC')
    amount_rub = float(data.get('amount_rub', 999))
    listing_id = data.get('listing_id')
    
    # Получаем курс криптовалюты
    import requests
    try:
        response = requests.get(
            'https://api.coingecko.com/api/v3/simple/price',
            params={
                'ids': 'bitcoin,ethereum,litecoin',
                'vs_currencies': 'rub'
            },
            timeout=5
        )
        
        if response.status_code == 200:
            rates_data = response.json()
            crypto_map = {
                'BTC': 'bitcoin',
                'ETH': 'ethereum',
                'LTC': 'litecoin'
            }
            rate = float(rates_data.get(crypto_map[crypto_currency], {}).get('rub', 0))
        else:
            # Fallback rates
            rate = {'BTC': 6000000, 'ETH': 250000, 'LTC': 8000}.get(crypto_currency, 6000000)
    except:
        rate = {'BTC': 6000000, 'ETH': 250000, 'LTC': 8000}.get(crypto_currency, 6000000)
    
    if rate == 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid crypto currency'}),
            'isBase64Encoded': False
        }
    
    # Рассчитываем сумму в крипте
    amount_crypto = amount_rub / rate
    
    # Генерируем уникальный адрес для платежа (для демо - это просто UUID)
    payment_address = generate_payment_address(crypto_currency)
    invoice_id = str(uuid.uuid4())
    
    # Сохраняем счет в БД
    cur.execute('''
        INSERT INTO t_p8292906_anonimcity_platform.crypto_invoices 
        (invoice_id, user_id, listing_id, crypto_currency, amount_crypto, amount_rub, 
         exchange_rate, payment_address, status, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (invoice_id, user_id, listing_id, crypto_currency, amount_crypto, amount_rub, 
          rate, payment_address, 'pending', datetime.now()))
    
    invoice_db_id = cur.fetchone()[0]
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'invoice_id': invoice_id,
            'payment_address': payment_address,
            'crypto_currency': crypto_currency,
            'amount_crypto': round(amount_crypto, 8),
            'amount_rub': amount_rub,
            'exchange_rate': rate,
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        }),
        'isBase64Encoded': False
    }


def check_payment_status(method, event, cur, conn):
    '''Проверить статус платежа'''
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    invoice_id = query_params.get('invoice_id')
    
    if not invoice_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invoice ID required'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        SELECT invoice_id, crypto_currency, amount_crypto, amount_rub, payment_address,
               status, created_at, paid_at, listing_id
        FROM t_p8292906_anonimcity_platform.crypto_invoices
        WHERE invoice_id = %s
    ''', (invoice_id,))
    
    row = cur.fetchone()
    
    if not row:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invoice not found'}),
            'isBase64Encoded': False
        }
    
    invoice = {
        'invoice_id': row[0],
        'crypto_currency': row[1],
        'amount_crypto': float(row[2]),
        'amount_rub': float(row[3]),
        'payment_address': row[4],
        'status': row[5],
        'created_at': row[6].isoformat() if row[6] else None,
        'paid_at': row[7].isoformat() if row[7] else None,
        'listing_id': row[8]
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(invoice),
        'isBase64Encoded': False
    }


def get_payment_address(method, event, cur, conn):
    '''Получить адрес для оплаты по валюте'''
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    crypto_currency = query_params.get('currency', 'BTC')
    
    address = generate_payment_address(crypto_currency)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'crypto_currency': crypto_currency,
            'payment_address': address
        }),
        'isBase64Encoded': False
    }


def generate_payment_address(crypto_currency: str) -> str:
    '''Генерировать платежный адрес (для демо)'''
    # В реальном приложении здесь будет интеграция с реальным крипто-провайдером
    # Сейчас возвращаем демо-адреса для разных валют
    demo_addresses = {
        'BTC': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        'ETH': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        'LTC': 'LQTpS3VaYTjCr4s9Y8R3jGhXQz4w7bXXXX'
    }
    return demo_addresses.get(crypto_currency, demo_addresses['BTC'])
