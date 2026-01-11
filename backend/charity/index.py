import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для обработки благотворительных пожертвований'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': ''
        }
    
    action = event.get('queryStringParameters', {}).get('action', '')
    
    try:
        if action == 'donate' and method == 'POST':
            return handle_donation(event)
        elif action == 'projects' and method == 'GET':
            return get_projects()
        elif action == 'my_donations' and method == 'GET':
            return get_user_donations(event)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handle_donation(event: dict) -> dict:
    user_id = event.get('headers', {}).get('X-User-Id')
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    amount = body.get('amount')
    project_id = body.get('project_id')
    message = body.get('message', '')
    
    if not amount or amount <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid amount'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        'SELECT balance_rub FROM t_p8292906_anonimcity_platform.wallets WHERE user_id = %s',
        (user_id,)
    )
    wallet = cur.fetchone()
    
    if not wallet or wallet[0] < amount:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Insufficient balance'})
        }
    
    cur.execute(
        'UPDATE t_p8292906_anonimcity_platform.wallets SET balance_rub = balance_rub - %s WHERE user_id = %s',
        (amount, user_id)
    )
    
    cur.execute(
        '''INSERT INTO t_p8292906_anonimcity_platform.charity_donations 
           (user_id, project_id, amount, message) 
           VALUES (%s, %s, %s, %s) RETURNING id''',
        (user_id, project_id, amount, message)
    )
    donation_id = cur.fetchone()[0]
    
    if project_id:
        cur.execute(
            'UPDATE t_p8292906_anonimcity_platform.charity_projects SET raised = raised + %s WHERE id = %s',
            (amount, project_id)
        )
    
    cur.execute(
        '''INSERT INTO t_p8292906_anonimcity_platform.transactions 
           (user_id, type, amount, status, created_at) 
           VALUES (%s, %s, %s, %s, %s)''',
        (user_id, 'charity_donation', -amount, 'completed', datetime.now())
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'donation_id': donation_id,
            'amount': amount,
            'message': 'Donation successful'
        })
    }

def get_projects() -> dict:
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        '''SELECT id, title, description, goal, raised, category, image, status, created_at 
           FROM t_p8292906_anonimcity_platform.charity_projects 
           ORDER BY created_at DESC'''
    )
    
    projects = []
    for row in cur.fetchall():
        projects.append({
            'id': str(row[0]),
            'title': row[1],
            'description': row[2],
            'goal': float(row[3]),
            'raised': float(row[4]),
            'category': row[5],
            'image': row[6],
            'status': row[7],
            'created_at': row[8].isoformat() if row[8] else None
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(projects)
    }

def get_user_donations(event: dict) -> dict:
    user_id = event.get('headers', {}).get('X-User-Id')
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        '''SELECT d.id, d.amount, d.message, d.created_at, p.title 
           FROM t_p8292906_anonimcity_platform.charity_donations d
           LEFT JOIN t_p8292906_anonimcity_platform.charity_projects p ON d.project_id = p.id
           WHERE d.user_id = %s 
           ORDER BY d.created_at DESC''',
        (user_id,)
    )
    
    donations = []
    for row in cur.fetchall():
        donations.append({
            'id': row[0],
            'amount': float(row[1]),
            'message': row[2],
            'created_at': row[3].isoformat() if row[3] else None,
            'project_title': row[4] or 'Общий фонд'
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(donations)
    }
