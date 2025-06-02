import os
import jwt
import functools
from datetime import datetime
from flask import request, jsonify, make_response, redirect, url_for, g
from bson import ObjectId
from .routes import get_route_permission

# المتغيرات العالمية (سيتم تعيينها عند التهيئة)
JWT_SECRET = None
users_collection = None
update_user_status = None

def initialize(jwt_secret, users_coll, update_status_func):
    """
    تهيئة وحدة الأمان مع المتغيرات المطلوبة
    
    Args:
        jwt_secret (str): المفتاح السري لتوثيق JWT
        users_coll: مجموعة المستخدمين في MongoDB
        update_status_func: وظيفة تحديث حالة المستخدم
    """
    global JWT_SECRET, users_collection, update_user_status
    JWT_SECRET = jwt_secret
    users_collection = users_coll
    update_user_status = update_status_func
    print("Security module initialized successfully")

def verify_auth_token(token):
    """
    التحقق من صحة توكن JWT والحصول على بيانات المستخدم
    
    Args:
        token (str): توكن JWT
        
    Returns:
        dict: بيانات المستخدم
        
    Raises:
        Exception: في حالة فشل التحقق من التوكن
    """
    try:
        # فك تشفير التوكن
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        user_id = payload.get('sub') or payload.get('user_id')
        
        if not user_id:
            raise Exception("Invalid token format")
        
        # التحقق من وجود المستخدم
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise Exception("User not found")
        
        # تحديث حالة المستخدم
        if update_user_status:
            update_user_status(user_id)
        
        return user
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
    except Exception as e:
        raise Exception(f"Token verification failed: {str(e)}")

def token_required(f):
    """
    مزخرف للتحقق من وجود توكن JWT صالح
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # محاولة الحصول على التوكن من هيدر التصريح
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1]
        
        # محاولة الحصول على التوكن من الكوكيز
        if not token:
            token = request.cookies.get('auth_token')
        
        # إذا لم يتم العثور على توكن
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # التحقق من التوكن
            user_data = verify_auth_token(token)
            request.user_data = user_data  # إضافة بيانات المستخدم إلى الطلب
            
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'message': str(e)}), 401
    
    return decorated_function

def owner_required(f):
    """
    مزخرف للتحقق من أن المستخدم هو مالك
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # محاولة الحصول على التوكن من هيدر التصريح
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1]
        
        # محاولة الحصول على التوكن من الكوكيز
        if not token:
            token = request.cookies.get('auth_token')
        
        # إذا لم يتم العثور على توكن
        if not token:
            if request.content_type == 'application/json' or request.path.startswith('/api/'):
                return jsonify({'message': 'Authentication required'}), 401
            else:
                return redirect(url_for('auth_bp.login', next=request.url))
        
        try:
            # التحقق من التوكن
            user_data = verify_auth_token(token)
            
            # التحقق من كون المستخدم مالكًا
            if not user_data.get('is_owner', False):
                if request.content_type == 'application/json' or request.path.startswith('/api/'):
                    return jsonify({'message': 'Owner privileges required'}), 403
                else:
                    # إعادة التوجيه إلى الصفحة المناسبة بناءً على نوع المستخدم
                    if user_data.get('is_booster', False):
                        return redirect(url_for('booster_bp.dashboard'))
                    else:
                        return redirect(url_for('client_bp.dashboard'))
            
            # تحديث حالة المستخدم وإضافة بيانات المستخدم إلى الطلب
            if update_user_status:
                update_user_status(str(user_data['_id']))
            
            request.user_data = user_data
            
            return f(*args, **kwargs)
        except Exception as e:
            if request.content_type == 'application/json' or request.path.startswith('/api/'):
                return jsonify({'message': str(e)}), 401
            else:
                return redirect(url_for('auth_bp.login', next=request.url))
    
    return decorated_function

def booster_required(f):
    """
    مزخرف للتحقق من أن المستخدم هو معزز
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # محاولة الحصول على التوكن من هيدر التصريح
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1]
        
        # محاولة الحصول على التوكن من الكوكيز
        if not token:
            token = request.cookies.get('auth_token')
        
        # إذا لم يتم العثور على توكن
        if not token:
            if request.content_type == 'application/json' or request.path.startswith('/api/'):
                return jsonify({'message': 'Authentication required'}), 401
            else:
                return redirect(url_for('auth_bp.login', next=request.url))
        
        try:
            # التحقق من التوكن
            user_data = verify_auth_token(token)
            
            # التحقق من كون المستخدم معززًا
            if not user_data.get('is_booster', False):
                if request.content_type == 'application/json' or request.path.startswith('/api/'):
                    return jsonify({'message': 'Booster privileges required'}), 403
                else:
                    # إعادة التوجيه إلى الصفحة المناسبة بناءً على نوع المستخدم
                    if user_data.get('is_owner', False):
                        return redirect(url_for('owner_bp.dashboard'))
                    else:
                        return redirect(url_for('client_bp.dashboard'))
            
            # تحديث حالة المستخدم وإضافة بيانات المستخدم إلى الطلب
            if update_user_status:
                update_user_status(str(user_data['_id']))
            
            request.user_data = user_data
            
            return f(*args, **kwargs)
        except Exception as e:
            if request.content_type == 'application/json' or request.path.startswith('/api/'):
                return jsonify({'message': str(e)}), 401
            else:
                return redirect(url_for('auth_bp.login', next=request.url))
    
    return decorated_function

def client_required(f):
    """
    مزخرف للتحقق من أن المستخدم هو عميل
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # محاولة الحصول على التوكن من هيدر التصريح
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1]
        
        # محاولة الحصول على التوكن من الكوكيز
        if not token:
            token = request.cookies.get('auth_token')
        
        # إذا لم يتم العثور على توكن
        if not token:
            if request.content_type == 'application/json' or request.path.startswith('/api/'):
                return jsonify({'message': 'Authentication required'}), 401
            else:
                return redirect(url_for('auth_bp.login', next=request.url))
        
        try:
            # التحقق من التوكن
            user_data = verify_auth_token(token)
            
            # التحقق من كون المستخدم عميلًا (ليس مالكًا أو معززًا)
            if user_data.get('is_owner', False) or user_data.get('is_booster', False):
                if request.content_type == 'application/json' or request.path.startswith('/api/'):
                    return jsonify({'message': 'Client privileges required'}), 403
                else:
                    # إعادة التوجيه إلى الصفحة المناسبة بناءً على نوع المستخدم
                    if user_data.get('is_owner', False):
                        return redirect(url_for('owner_bp.dashboard'))
                    else:
                        return redirect(url_for('booster_bp.dashboard'))
            
            # تحديث حالة المستخدم وإضافة بيانات المستخدم إلى الطلب
            if update_user_status:
                update_user_status(str(user_data['_id']))
            
            request.user_data = user_data
            
            return f(*args, **kwargs)
        except Exception as e:
            if request.content_type == 'application/json' or request.path.startswith('/api/'):
                return jsonify({'message': str(e)}), 401
            else:
                return redirect(url_for('auth_bp.login', next=request.url))
    
    return decorated_function

def secure_api_endpoint(f):
    """
    مزخرف لتأمين نقاط نهاية API
    يتحقق من وجود توكن صالح ولكن لا يتطلب صلاحيات معينة
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # محاولة الحصول على التوكن من هيدر التصريح
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1]
        
        # محاولة الحصول على التوكن من الكوكيز
        if not token:
            token = request.cookies.get('auth_token')
        
        # إضافة بيانات المستخدم إلى الطلب
        if token:
            try:
                user_data = verify_auth_token(token)
                request.user_data = user_data
            except Exception:
                # في حالة فشل التحقق من التوكن، نعين بيانات المستخدم كـ None
                request.user_data = None
        else:
            request.user_data = None
        
        return f(*args, **kwargs)
    
    return decorated_function

def secure_route(role=None):
    """
    مزخرف لتأمين المسارات بناءً على الدور المطلوب
    
    Args:
        role (str): الدور المطلوب ('owner', 'booster', 'client')، أو None للمسارات العامة
    """
    def decorator(f):
        @functools.wraps(f)
        def decorated_function(*args, **kwargs):
            # المسارات العامة لا تتطلب توثيقًا
            if role is None:
                return f(*args, **kwargs)
            
            token = None
            
            # محاولة الحصول على التوكن من هيدر التصريح
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split('Bearer ')[1]
            
            # محاولة الحصول على التوكن من الكوكيز
            if not token:
                token = request.cookies.get('auth_token')
            
            # إذا لم يتم العثور على توكن
            if not token:
                if request.content_type == 'application/json' or request.path.startswith('/api/'):
                    return jsonify({'message': 'Authentication required'}), 401
                else:
                    return redirect(url_for('auth_bp.login', next=request.url))
            
            try:
                # التحقق من التوكن
                user_data = verify_auth_token(token)
                
                # تحديد دور المستخدم
                user_role = None
                if user_data.get('is_owner', False):
                    user_role = 'owner'
                elif user_data.get('is_booster', False):
                    user_role = 'booster'
                else:
                    user_role = 'client'
                
                # التحقق من كون المستخدم لديه الدور المطلوب
                if user_role != role:
                    if request.content_type == 'application/json' or request.path.startswith('/api/'):
                        return jsonify({'message': f'{role.capitalize()} privileges required'}), 403
                    else:
                        if user_role == 'owner':
                            return redirect(url_for('owner_bp.dashboard'))
                        elif user_role == 'booster':
                            return redirect(url_for('booster_bp.dashboard'))
                        else:
                            return redirect(url_for('client_bp.dashboard'))
                
                # تحديث حالة المستخدم وإضافة بيانات المستخدم إلى الطلب
                if update_user_status:
                    update_user_status(str(user_data['_id']))
                
                request.user_data = user_data
                
                return f(*args, **kwargs)
            except Exception as e:
                if request.content_type == 'application/json' or request.path.startswith('/api/'):
                    return jsonify({'message': str(e)}), 401
                else:
                    return redirect(url_for('auth_bp.login', next=request.url))
        
        return decorated_function
    
    return decorator 