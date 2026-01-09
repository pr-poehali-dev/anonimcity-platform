import json
import os
import psycopg2
from datetime import datetime
import hashlib
import secrets

def handler(event: dict, context) -> dict:
    '''API для регистрации и авторизации пользователей на анонимной платформе'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'POST':
        if path == 'register':
            return register_user(event)
        elif path == 'login':
            return login_user(event)
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid action or method'})
    }

def register_user(event: dict) -> dict:
    try:
        body = json.loads(event.get('body', '{}'))
        login = body.get('login', '').strip()
        password = body.get('password', '').strip()
        
        if not login or not password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Login and password are required'})
            }
        
        if not login.startswith('anon_'):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Login must start with anon_'})
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        schema = os.environ['MAIN_DB_SCHEMA']
        
        cursor.execute(f"SELECT id FROM {schema}.users WHERE login = %s", (login,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Login already exists'})
            }
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cursor.execute(
            f"INSERT INTO {schema}.users (login, password, created_at) VALUES (%s, %s, %s) RETURNING id",
            (login, password_hash, datetime.utcnow())
        )
        user_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'user_id': user_id,
                'login': login
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def login_user(event: dict) -> dict:
    try:
        body = json.loads(event.get('body', '{}'))
        login = body.get('login', '').strip()
        password = body.get('password', '').strip()
        
        if not login or not password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Login and password are required'})
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        schema = os.environ['MAIN_DB_SCHEMA']
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        cursor.execute(
            f"SELECT id, login FROM {schema}.users WHERE login = %s AND password = %s",
            (login, password_hash)
        )
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid login or password'})
            }
        
        cursor.execute(
            f"UPDATE {schema}.users SET last_login = %s WHERE id = %s",
            (datetime.utcnow(), user[0])
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        session_token = secrets.token_urlsafe(32)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'user_id': user[0],
                'login': user[1],
                'session_token': session_token
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
