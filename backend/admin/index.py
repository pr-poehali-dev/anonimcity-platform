import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для администрирования: категории, модели, заявки'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    resource = query_params.get('resource')
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if resource == 'categories':
            return handle_categories(method, event, cur, conn)
        elif resource == 'models':
            return handle_models(method, event, cur, conn)
        elif resource == 'applications':
            return handle_applications(method, event, cur, conn)
        elif resource == 'letters':
            return handle_letters(method, event, cur, conn)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid resource'}),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()


def handle_categories(method, event, cur, conn):
    if method == 'GET':
        cur.execute('SELECT * FROM t_p8292906_anonimcity_platform.categories ORDER BY id')
        categories = cur.fetchall()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(cat) for cat in categories], default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        name = body.get('name')
        icon = body.get('icon', '')
        color = body.get('color', '')
        
        cur.execute(
            'INSERT INTO t_p8292906_anonimcity_platform.categories (name, icon, color) VALUES (%s, %s, %s) RETURNING id',
            (name, icon, color)
        )
        category_id = cur.fetchone()['id']
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'category_id': category_id}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        category_id = body.get('id')
        name = body.get('name')
        icon = body.get('icon')
        color = body.get('color')
        
        cur.execute(
            'UPDATE t_p8292906_anonimcity_platform.categories SET name=%s, icon=%s, color=%s WHERE id=%s',
            (name, icon, color, category_id)
        )
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        query_params = event.get('queryStringParameters') or {}
        category_id = query_params.get('id')
        
        cur.execute('DELETE FROM t_p8292906_anonimcity_platform.categories WHERE id=%s', (category_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def handle_models(method, event, cur, conn):
    if method == 'GET':
        cur.execute('SELECT * FROM t_p8292906_anonimcity_platform.models ORDER BY id')
        models = cur.fetchall()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(m) for m in models], default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cur.execute(
            '''INSERT INTO t_p8292906_anonimcity_platform.models 
            (name, username, age, location, rating, reviews, image_url, status) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id''',
            (body.get('name'), body.get('username'), body.get('age'), 
             body.get('location'), body.get('rating', 0), body.get('reviews', 0),
             body.get('image_url'), body.get('status', 'active'))
        )
        model_id = cur.fetchone()['id']
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'model_id': model_id}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        model_id = body.get('id')
        
        cur.execute(
            '''UPDATE t_p8292906_anonimcity_platform.models 
            SET name=%s, username=%s, age=%s, location=%s, rating=%s, reviews=%s, image_url=%s, status=%s 
            WHERE id=%s''',
            (body.get('name'), body.get('username'), body.get('age'),
             body.get('location'), body.get('rating'), body.get('reviews'),
             body.get('image_url'), body.get('status'), model_id)
        )
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        query_params = event.get('queryStringParameters') or {}
        model_id = query_params.get('id')
        
        cur.execute('DELETE FROM t_p8292906_anonimcity_platform.models WHERE id=%s', (model_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def handle_applications(method, event, cur, conn):
    if method == 'GET':
        cur.execute('SELECT * FROM t_p8292906_anonimcity_platform.model_applications ORDER BY submitted_at DESC')
        applications = cur.fetchall()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(app) for app in applications], default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cur.execute(
            '''INSERT INTO t_p8292906_anonimcity_platform.model_applications 
            (name, age, city, telegram, experience) 
            VALUES (%s, %s, %s, %s, %s) RETURNING id''',
            (body.get('name'), body.get('age'), body.get('city'),
             body.get('telegram'), body.get('experience'))
        )
        app_id = cur.fetchone()['id']
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'application_id': app_id}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        app_id = body.get('id')
        status = body.get('status')
        
        cur.execute(
            'UPDATE t_p8292906_anonimcity_platform.model_applications SET status=%s, reviewed_at=CURRENT_TIMESTAMP WHERE id=%s',
            (status, app_id)
        )
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        query_params = event.get('queryStringParameters') or {}
        app_id = query_params.get('id')
        
        cur.execute('DELETE FROM t_p8292906_anonimcity_platform.model_applications WHERE id=%s', (app_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }


def handle_letters(method, event, cur, conn):
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        recipient = query_params.get('recipient')
        
        if recipient:
            cur.execute(
                'SELECT * FROM t_p8292906_anonimcity_platform.anonymous_letters WHERE recipient_login=%s ORDER BY created_at DESC',
                (recipient,)
            )
        else:
            cur.execute('SELECT * FROM t_p8292906_anonimcity_platform.anonymous_letters ORDER BY created_at DESC')
        
        letters = cur.fetchall()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(letter) for letter in letters], default=str),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cur.execute(
            '''INSERT INTO t_p8292906_anonimcity_platform.anonymous_letters 
            (sender_login, recipient_login, message) 
            VALUES (%s, %s, %s) RETURNING id''',
            (body.get('sender_login'), body.get('recipient_login'), body.get('message'))
        )
        letter_id = cur.fetchone()['id']
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'letter_id': letter_id}),
            'isBase64Encoded': False
        }
