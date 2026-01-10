import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для обращений в службу поддержки'''
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
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        schema = os.environ.get('MAIN_DB_SCHEMA', 't_p8292906_anonimcity_platform')
        
        if method == 'GET':
            cur.execute(f"""
                SELECT id, subject, message, status, created_at
                FROM {schema}.support_tickets
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (int(user_id),))
            
            rows = cur.fetchall()
            tickets = []
            for row in rows:
                tickets.append({
                    'id': row[0],
                    'subject': row[1],
                    'message': row[2],
                    'status': row[3],
                    'created_at': row[4].strftime('%Y-%m-%d %H:%M')
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(tickets)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            subject = body.get('subject', '').strip()
            message = body.get('message', '').strip()
            
            if not all([subject, message]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'subject and message are required'})
                }
            
            cur.execute(f"SELECT login FROM {schema}.users WHERE id = %s", (int(user_id),))
            user = cur.fetchone()
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
                }
            
            user_login = user[0]
            
            cur.execute(f"""
                INSERT INTO {schema}.support_tickets 
                (user_id, user_login, subject, message, created_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (int(user_id), user_login, subject, message, datetime.now()))
            
            ticket_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'ticket_id': ticket_id})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
