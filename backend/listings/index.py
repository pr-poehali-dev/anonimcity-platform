import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для работы с объявлениями на платформе'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Admin-Action'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        schema = os.environ.get('MAIN_DB_SCHEMA', 't_p8292906_anonimcity_platform')
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            listing_id = params.get('id')
            category = params.get('category')
            
            if listing_id:
                cur.execute(f"""
                    UPDATE {schema}.listings 
                    SET views_count = views_count + 1 
                    WHERE id = %s
                """, (int(listing_id),))
                conn.commit()
                
                cur.execute(f"""
                    SELECT l.id, l.title, l.description, l.category, l.price, l.currency,
                           l.location, l.images, l.status, l.views_count, l.created_at,
                           u.login
                    FROM {schema}.listings l
                    JOIN {schema}.users u ON l.user_id = u.id
                    WHERE l.id = %s
                """, (int(listing_id),))
            elif user_id:
                cur.execute(f"""
                    SELECT l.id, l.title, l.description, l.category, l.price, l.currency,
                           l.location, l.images, l.status, l.views_count, l.created_at,
                           u.login
                    FROM {schema}.listings l
                    JOIN {schema}.users u ON l.user_id = u.id
                    WHERE l.user_id = %s
                    ORDER BY l.created_at DESC
                """, (int(user_id),))
            elif category:
                cur.execute(f"""
                    SELECT l.id, l.title, l.description, l.category, l.price, l.currency,
                           l.location, l.images, l.status, l.views_count, l.created_at,
                           u.login
                    FROM {schema}.listings l
                    JOIN {schema}.users u ON l.user_id = u.id
                    WHERE l.category = %s AND l.status = 'active'
                    ORDER BY l.created_at DESC
                """, (category,))
            else:
                cur.execute(f"""
                    SELECT l.id, l.title, l.description, l.category, l.price, l.currency,
                           l.location, l.images, l.status, l.views_count, l.created_at,
                           u.login
                    FROM {schema}.listings l
                    JOIN {schema}.users u ON l.user_id = u.id
                    WHERE l.status = 'active'
                    ORDER BY l.created_at DESC
                    LIMIT 100
                """)
            
            rows = cur.fetchall()
            listings = []
            for row in rows:
                listings.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'category': row[3],
                    'price': float(row[4]) if row[4] else None,
                    'currency': row[5],
                    'location': row[6],
                    'images': row[7] or [],
                    'status': row[8],
                    'views_count': row[9],
                    'created_at': row[10].strftime('%Y-%m-%d %H:%M'),
                    'seller': row[11]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(listings[0] if listing_id else listings)
            }
        
        elif method == 'POST':
            headers = event.get('headers', {})
            user_id = headers.get('x-user-id') or headers.get('X-User-Id')
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            body = json.loads(event.get('body', '{}'))
            title = body.get('title', '').strip()
            description = body.get('description', '').strip()
            category = body.get('category', '').strip()
            price = body.get('price')
            currency = body.get('currency', 'RUB')
            location = body.get('location', '').strip()
            images = body.get('images', [])
            
            if not all([title, description, category]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'title, description, category are required'})
                }
            
            cur.execute(f"""
                INSERT INTO {schema}.listings 
                (user_id, title, description, category, price, currency, location, images, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (int(user_id), title, description, category, price, currency, location, images, datetime.now()))
            
            listing_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'listing_id': listing_id})
            }
        
        elif method == 'PUT':
            headers = event.get('headers', {})
            user_id = headers.get('x-user-id') or headers.get('X-User-Id')
            admin_action = headers.get('x-admin-action') or headers.get('X-Admin-Action')
            
            body = json.loads(event.get('body', '{}'))
            listing_id = body.get('listing_id') or body.get('id')
            status = body.get('status')
            
            if not listing_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'listing id required'})
                }
            
            if admin_action in ['approve', 'update']:
                if status:
                    cur.execute(f"""
                        UPDATE {schema}.listings 
                        SET status = %s, updated_at = %s
                        WHERE id = %s
                    """, (status, datetime.now(), int(listing_id)))
                else:
                    update_fields = []
                    params = []
                    
                    for field in ['title', 'description', 'price', 'location']:
                        if field in body:
                            update_fields.append(f"{field} = %s")
                            params.append(body[field])
                    
                    if update_fields:
                        update_fields.append("updated_at = %s")
                        params.extend([datetime.now(), int(listing_id)])
                        
                        cur.execute(f"""
                            UPDATE {schema}.listings 
                            SET {', '.join(update_fields)}
                            WHERE id = %s
                        """, params)
            elif user_id:
                if status:
                    cur.execute(f"""
                        UPDATE {schema}.listings 
                        SET status = %s, updated_at = %s
                        WHERE id = %s AND user_id = %s
                    """, (status, datetime.now(), int(listing_id), int(user_id)))
                else:
                    update_fields = []
                    params = []
                    
                    for field in ['title', 'description', 'price', 'location']:
                        if field in body:
                            update_fields.append(f"{field} = %s")
                            params.append(body[field])
                    
                    if update_fields:
                        update_fields.append("updated_at = %s")
                        params.extend([datetime.now(), int(listing_id), int(user_id)])
                        
                        cur.execute(f"""
                            UPDATE {schema}.listings 
                            SET {', '.join(update_fields)}
                            WHERE id = %s AND user_id = %s
                        """, params)
            else:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        elif method == 'DELETE':
            headers = event.get('headers', {})
            user_id = headers.get('x-user-id') or headers.get('X-User-Id')
            admin_action = headers.get('x-admin-action') or headers.get('X-Admin-Action')
            
            if admin_action == 'delete_all':
                cur.execute(f"DELETE FROM {schema}.listings")
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'All listings deleted'})
                }
            
            if not user_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            params = event.get('queryStringParameters') or {}
            listing_id = params.get('id')
            
            if not listing_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'listing id required'})
                }
            
            cur.execute(f"""
                DELETE FROM {schema}.listings 
                WHERE id = %s AND user_id = %s
            """, (int(listing_id), int(user_id)))
            
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