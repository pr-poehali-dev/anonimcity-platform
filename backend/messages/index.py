import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для работы с сообщениями между пользователями'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            'body': json.dumps({'error': 'Unauthorized - user_id required'})
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        schema = os.environ.get('MAIN_DB_SCHEMA', 't_p8292906_anonimcity_platform')
        
        if method == 'GET':
            cur.execute(f"""
                SELECT m.id, 
                       sender.login as sender, 
                       m.subject, 
                       m.text as preview,
                       m.text,
                       m.created_at, 
                       m.is_read,
                       m.sender_id
                FROM {schema}.messages m
                JOIN {schema}.users sender ON m.sender_id = sender.id
                WHERE m.receiver_id = %s
                ORDER BY m.created_at DESC
            """, (int(user_id),))
            
            rows = cur.fetchall()
            messages = []
            for row in rows:
                messages.append({
                    'id': row[0],
                    'sender': row[1],
                    'senderType': 'admin' if row[7] == 1 else 'user',
                    'subject': row[2],
                    'preview': row[3][:100] + '...' if len(row[3]) > 100 else row[3],
                    'text': row[4],
                    'date': row[5].strftime('%Y-%m-%d %H:%M'),
                    'isRead': row[6]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(messages)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            receiver_id = body.get('receiver_id')
            subject = body.get('subject', '').strip()
            text = body.get('text', '').strip()
            
            if not all([receiver_id, subject, text]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'receiver_id, subject, text are required'})
                }
            
            cur.execute(f"""
                INSERT INTO {schema}.messages (sender_id, receiver_id, subject, text, created_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (int(user_id), int(receiver_id), subject, text, datetime.now()))
            
            message_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message_id': message_id})
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            message_id = body.get('message_id')
            
            if not message_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'message_id required'})
                }
            
            cur.execute(f"""
                UPDATE {schema}.messages 
                SET is_read = TRUE 
                WHERE id = %s AND receiver_id = %s
            """, (int(message_id), int(user_id)))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
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
