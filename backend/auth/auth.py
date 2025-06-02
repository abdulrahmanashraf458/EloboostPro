import os
import jwt
import json
import random
import requests
import datetime
import time
from functools import wraps
from bson.objectid import ObjectId
from dotenv import load_dotenv
from flask import Blueprint, request, redirect, jsonify, make_response, g, current_app
from pymongo import MongoClient
import sys

# تحميل ملف الإعدادات
# تحديث المسار ليشير إلى المجلد الرئيسي
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config.env')
load_dotenv(dotenv_path)

# -----------------------------------------------------------------------------
# إعدادات الاتصال وقيم الإعدادات
# -----------------------------------------------------------------------------

# إعدادات Discord
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_BOT_TOKEN = os.getenv('DISCORD_BOT_TOKEN')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI')

# إعدادات Google
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')

# إعدادات MongoDB
MONGODB_URI = os.getenv('MONGODB_URI')

# إعدادات JWT
JWT_SECRET = os.getenv('JWT_SECRET')
JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION', '86400'))  # تحويل إلى عدد صحيح

# إعدادات الكوكيز
COOKIE_SECURE = os.getenv('COOKIE_SECURE', 'false').lower() == 'true'
COOKIE_SAMESITE = os.getenv('COOKIE_SAMESITE', 'Lax')
COOKIE_HTTPONLY = os.getenv('COOKIE_HTTPONLY', 'true').lower() == 'true'
COOKIE_PATH = os.getenv('COOKIE_PATH', '/')
COOKIE_MAX_AGE = int(os.getenv('COOKIE_MAX_AGE', '2592000'))  # 30 يوم افتراضياً

# IPinfo.io API
IPINFO_API_TOKENS = [
    os.getenv('IPINFO_API_TOKEN_1'),
    os.getenv('IPINFO_API_TOKEN_2'),
    os.getenv('IPINFO_API_TOKEN_3')
]

# عناوين API
DISCORD_API_URL = 'https://discord.com/api/v10'
DISCORD_AUTH_URL = f'https://discord.com/oauth2/authorize?client_id={DISCORD_CLIENT_ID}&redirect_uri={DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20email'

GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

# إعدادات الموقع
FRONTEND_URL = "http://localhost:5000"

# -----------------------------------------------------------------------------
# اتصال قاعدة البيانات
# -----------------------------------------------------------------------------

# إنشاء اتصال مع قاعدة البيانات MongoDB
client = MongoClient(MONGODB_URI)
db = client.get_database("elo_boost_pro")
users_collection = db.users
sessions_collection = db.sessions

# -----------------------------------------------------------------------------
# وظائف مساعدة
# -----------------------------------------------------------------------------

def get_client_ip(request):
    """استخراج عنوان IP المستخدم من الطلب"""
    client_ip = None
    if 'X-Forwarded-For' in request.headers:
        client_ip = request.headers['X-Forwarded-For'].split(',')[0].strip()
    else:
        client_ip = request.remote_addr
    
    # إذا كان العنوان هو localhost (127.0.0.1)، استخدم خدمة خارجية
    if client_ip == '127.0.0.1' or client_ip == 'localhost':
        try:
            # استخدام خدمة خارجية للحصول على IP العام
            response = requests.get('https://api.ipify.org?format=json', timeout=5)
            if response.status_code == 200:
                return response.json()['ip']
        except Exception as e:
            print(f"Error getting public IP: {str(e)}")
    
    return client_ip

def get_ip_info(ip_address):
    """الحصول على معلومات الموقع الجغرافي من عنوان IP"""
    token = random.choice(IPINFO_API_TOKENS)
    
    try:
        response = requests.get(f"https://ipinfo.io/{ip_address}?token={token}")
        
        if response.status_code == 200:
            data = response.json()
            return {
                'ip': data.get('ip', ''),
                'city': data.get('city', ''),
                'region': data.get('region', ''),
                'country': data.get('country', ''),
                'loc': data.get('loc', ''),
                'org': data.get('org', ''),
                'postal': data.get('postal', ''),
                'timezone': data.get('timezone', '')
            }
        return {'ip': ip_address, 'error': f"API request failed with status code {response.status_code}"}
    except Exception as e:
        return {'ip': ip_address, 'error': str(e)}

def generate_token(user_id, username=None, email=None, is_owner=False, is_booster=False, avatar=None):
    """توليد توكن JWT للمستخدم مع جميع المعلومات المطلوبة"""
    # إذا كانت المعلومات الإضافية غير موجودة، ابحث عنها في قاعدة البيانات
    if username is None or email is None:
        try:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                username = user.get('username', 'User')
                email = user.get('email', '')
                is_owner = user.get('is_owner', False)
                is_booster = user.get('is_booster', False)
        except Exception as e:
            print(f"Error retrieving user data for token generation: {e}")
    
    # إعداد البيانات للتوكن
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXPIRATION),
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id),
        'user_id': str(user_id),  # للتوافق
        'username': username,
        'email': email,
        'is_owner': is_owner,
        'is_booster': is_booster,
        'avatar': avatar
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def decode_token(token):
    """فك تشفير توكن JWT"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except:
        return None

def token_required(f):
    """ديكوريتور للتحقق من صحة التوكن"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        elif 'auth_token' in request.cookies:
            token = request.cookies.get('auth_token')
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
            
        user_data = verify_auth_token(token)
        if not user_data:
            return jsonify({'message': 'Invalid or expired token!'}), 401
            
        # تحديث حالة المستخدم كمتصل
        update_user_status(user_data.get('user_id'), True)
        
        g.user = user_data
        return f(*args, **kwargs)
        
    return decorated

def set_auth_cookies(response, token, max_age=JWT_EXPIRATION):
    """تعيين كوكيز التوثيق في الاستجابة"""
    # حساب تاريخ انتهاء الصلاحية
    expires = datetime.datetime.now() + datetime.timedelta(seconds=max_age)
    
    # تعيين التوكن في الكوكيز
    response.set_cookie(
        'auth_token', 
        token, 
        max_age=max_age,
        expires=expires,
        httponly=COOKIE_HTTPONLY, 
        secure=COOKIE_SECURE,
        path=COOKIE_PATH,
        samesite=COOKIE_SAMESITE,
        domain=None  # يستخدم نطاق الخادم الحالي
    )
    return response

# -----------------------------------------------------------------------------
# وظائف مساعدة للتعامل مع OAuth
# -----------------------------------------------------------------------------

def exchange_code_for_discord_token(code):
    """تبادل رمز مصادقة Discord برمز وصول"""
    token_data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI
    }
    
    try:
        response = requests.post('https://discord.com/api/oauth2/token', data=token_data)
        if response.status_code == 200:
            return response.json()
        print(f"Discord token exchange error: {response.status_code}, {response.text}")
        return None
    except Exception as e:
        print(f"Discord token exchange exception: {str(e)}")
        return None

def get_discord_user(access_token):
    """الحصول على معلومات مستخدم Discord باستخدام رمز الوصول"""
    headers = {'Authorization': f'Bearer {access_token}'}
    
    try:
        response = requests.get('https://discord.com/api/users/@me', headers=headers)
        if response.status_code == 200:
            return response.json()
        print(f"Discord user info error: {response.status_code}, {response.text}")
        return None
    except Exception as e:
        print(f"Discord user info exception: {str(e)}")
        return None

def exchange_code_for_google_token(code):
    """تبادل رمز مصادقة Google برمز وصول"""
    token_data = {
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': GOOGLE_REDIRECT_URI
    }
    
    try:
        response = requests.post('https://oauth2.googleapis.com/token', data=token_data)
        if response.status_code == 200:
            return response.json()
        print(f"Google token exchange error: {response.status_code}, {response.text}")
        return None
    except Exception as e:
        print(f"Google token exchange exception: {str(e)}")
        return None

def get_google_user(access_token):
    """الحصول على معلومات مستخدم Google باستخدام رمز الوصول"""
    headers = {'Authorization': f'Bearer {access_token}'}
    
    try:
        response = requests.get('https://www.googleapis.com/oauth2/v1/userinfo', headers=headers)
        if response.status_code == 200:
            return response.json()
        print(f"Google user info error: {response.status_code}, {response.text}")
        return None
    except Exception as e:
        print(f"Google user info exception: {str(e)}")
        return None

# -----------------------------------------------------------------------------
# إنشاء Blueprint للتوثيق
# -----------------------------------------------------------------------------

auth_bp = Blueprint('auth', __name__)

# -----------------------------------------------------------------------------
# مسارات Discord
# -----------------------------------------------------------------------------

@auth_bp.route('/discord/login')
def discord_login():
    """توجيه المستخدم إلى صفحة تسجيل دخول Discord"""
    return redirect(DISCORD_AUTH_URL)

@auth_bp.route('/discord/callback')
def discord_callback():
    """إستقبال ردود Discord بعد محاولة تسجيل الدخول"""
    code = request.args.get('code')
    if not code:
        return "Authorization code not provided", 400

    # إستبدال الكود برمز وصول
    token_data = exchange_code_for_discord_token(code)
    if not token_data:
        return "Failed to exchange code for access token", 400

    # إستخدام رمز الوصول للحصول على معلومات المستخدم
    user_data = get_discord_user(token_data['access_token'])
    if not user_data:
        return "Failed to get user info", 400

    print(f"[DISCORD AUTH] User data from Discord: {user_data}")

    # التحقق من وجود المستخدم في قاعدة البيانات أو إنشاء مستخدم جديد
    discord_id = user_data['id']
    
    # بناء رابط صورة المستخدم في Discord
    avatar_url = None
    if user_data.get('avatar'):
        # استخدام صورة بصيغة webp لسرعة التحميل
        avatar_url = f"https://cdn.discordapp.com/avatars/{discord_id}/{user_data['avatar']}.webp"
        print(f"[DISCORD AUTH] Avatar URL: {avatar_url}")
    
    existing_user = users_collection.find_one({"discord_id": discord_id})

    if existing_user:
        # تحديث بيانات المستخدم
        update_data = {
            "discord_name": user_data['username'],
            "last_login": datetime.datetime.utcnow(),
            "ip_address": get_client_ip(request),
            "ip_info": get_ip_info(get_client_ip(request)),
            "auth_provider": "discord"
        }
        
        # تحديث صورة المستخدم فقط إذا كان هناك صورة جديدة
        if avatar_url:
            update_data["avatar"] = avatar_url
            
        users_collection.update_one(
            {"_id": existing_user["_id"]},
            {"$set": update_data}
        )
        
        user_id = str(existing_user["_id"])
        username = existing_user.get("username")
        email = existing_user.get("email")
        is_owner = existing_user.get("is_owner", False)
        is_booster = existing_user.get("is_booster", False)
        avatar = avatar_url or existing_user.get("avatar")
        
        print(f"[DISCORD AUTH] Updated user: {username}, avatar: {avatar}")
    else:
        # إنشاء مستخدم جديد
        new_user = {
            "discord_id": discord_id,
            "discord_name": user_data['username'],
            "username": user_data['username'],
            "email": user_data.get('email', ''),
            "avatar": avatar_url,
            "created_at": datetime.datetime.utcnow(),
            "last_login": datetime.datetime.utcnow(),
            "ip_address": get_client_ip(request),
            "ip_info": get_ip_info(get_client_ip(request)),
            "auth_provider": "discord",
            "is_owner": False,  # قيمة افتراضية للمستخدم الجديد
            "is_booster": False  # قيمة افتراضية للمستخدم الجديد
        }
        result = users_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        username = user_data['username']
        email = user_data.get('email', '')
        is_owner = False
        is_booster = False
        avatar = avatar_url
        
        print(f"[DISCORD AUTH] Created new user: {username}, avatar: {avatar}")

    # تحديث حالة المستخدم كمتصل
    update_user_status(user_id, True)

    # إنشاء رمز JWT بما في ذلك الصورة
    token = generate_token(
        user_id, 
        username=username,
        email=email,
        is_owner=is_owner,
        is_booster=is_booster,
        avatar=avatar
    )

    # تحديد مسار إعادة التوجيه بشكل صحيح
    redirect_url = request.cookies.get('redirect_after_login', '/')
    resp = redirect(redirect_url)
    set_auth_cookies(resp, token, 60*60*24*30)  # صالح لمدة 30 يوم
    return resp

# -----------------------------------------------------------------------------
# مسارات Google
# -----------------------------------------------------------------------------

@auth_bp.route('/google/login')
def google_login():
    """توجيه المستخدم إلى صفحة تسجيل دخول Google"""
    # بناء عنوان URL للتوثيق
    auth_params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline',
        'prompt': 'consent'
    }
    
    auth_url = f"{GOOGLE_AUTH_URL}?"
    auth_url += "&".join([f"{key}={value}" for key, value in auth_params.items()])
    
    return redirect(auth_url)

@auth_bp.route('/google/callback')
def google_callback():
    """إستقبال ردود Google بعد محاولة تسجيل الدخول"""
    code = request.args.get('code')
    if not code:
        return "Authorization code not provided", 400

    # إستبدال الكود برمز وصول
    token_data = exchange_code_for_google_token(code)
    if not token_data:
        return "Failed to exchange code for access token", 400

    # إستخدام رمز الوصول للحصول على معلومات المستخدم
    user_data = get_google_user(token_data['access_token'])
    if not user_data:
        return "Failed to get user info", 400

    print(f"[GOOGLE AUTH] User data from Google: {user_data}")

    # التحقق من وجود المستخدم في قاعدة البيانات أو إنشاء مستخدم جديد
    google_id = user_data['id']
    
    # استخدام صورة المستخدم من Google
    avatar_url = user_data.get('picture')
    print(f"[GOOGLE AUTH] Avatar URL: {avatar_url}")
    
    existing_user = users_collection.find_one({"google_id": google_id})

    if existing_user:
        # تحديث بيانات المستخدم
        update_data = {
            "google_name": user_data['name'],
            "last_login": datetime.datetime.utcnow(),
            "ip_address": get_client_ip(request),
            "ip_info": get_ip_info(get_client_ip(request)),
            "auth_provider": "google"
        }
        
        # تحديث صورة المستخدم فقط إذا كان هناك صورة جديدة
        if avatar_url:
            update_data["avatar"] = avatar_url
            
        users_collection.update_one(
            {"_id": existing_user["_id"]},
            {"$set": update_data}
        )
        
        user_id = str(existing_user["_id"])
        username = existing_user.get("username")
        email = existing_user.get("email")
        is_owner = existing_user.get("is_owner", False)
        is_booster = existing_user.get("is_booster", False)
        avatar = avatar_url or existing_user.get("avatar")
        
        print(f"[GOOGLE AUTH] Updated user: {username}, avatar: {avatar}")
    else:
        # إنشاء مستخدم جديد
        new_user = {
            "google_id": google_id,
            "google_name": user_data['name'],
            "username": user_data['name'],
            "email": user_data.get('email', ''),
            "avatar": avatar_url,
            "created_at": datetime.datetime.utcnow(),
            "last_login": datetime.datetime.utcnow(),
            "ip_address": get_client_ip(request),
            "ip_info": get_ip_info(get_client_ip(request)),
            "auth_provider": "google",
            "is_owner": False,  # قيمة افتراضية للمستخدم الجديد
            "is_booster": False  # قيمة افتراضية للمستخدم الجديد
        }
        result = users_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        username = user_data['name']
        email = user_data.get('email', '')
        is_owner = False
        is_booster = False
        avatar = avatar_url
        
        print(f"[GOOGLE AUTH] Created new user: {username}, avatar: {avatar}")

    # تحديث حالة المستخدم كمتصل
    update_user_status(user_id, True)

    # إنشاء رمز JWT بما في ذلك الصورة
    token = generate_token(
        user_id, 
        username=username,
        email=email,
        is_owner=is_owner,
        is_booster=is_booster,
        avatar=avatar
    )

    # تحديد مسار إعادة التوجيه بشكل صحيح
    redirect_url = request.cookies.get('redirect_after_login', '/')
    resp = redirect(redirect_url)
    set_auth_cookies(resp, token, 60*60*24*30)  # صالح لمدة 30 يوم
    return resp

# -----------------------------------------------------------------------------
# مسارات المستخدم
# -----------------------------------------------------------------------------

@auth_bp.route('/user')
@token_required
def get_current_user():
    """الحصول على المستخدم الحالي المصادق عليه"""
    user = dict(g.user)  # تحويل إلى قاموس
    
    # إزالة المعلومات الحساسة
    user_id = user.pop('_id', user.get('user_id'))
    user.pop('ip_address', None)
    user.pop('ip_info', None)
    
    return jsonify({
        'success': True,
        'user': {
            'id': str(user_id),
            'username': user.get('username'),
            'email': user.get('email'),
            'avatar': user.get('avatar'),
            'auth_provider': user.get('auth_provider'),
            'is_owner': user.get('is_owner', False),
            'is_booster': user.get('is_booster', False)
        }
    })

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """تسجيل خروج المستخدم الحالي"""
    response = make_response(jsonify({'success': True, 'message': 'Logged out successfully'}))
    response.delete_cookie('auth_token')
    return response

@auth_bp.route('/check-token', methods=['GET', 'OPTIONS'])
def check_token():
    """التحقق من صحة توكن المستخدم وإعادة بياناته للـ Navbar"""
    if request.method == 'OPTIONS':
        # التعامل مع طلبات CORS preflight
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Max-Age', '86400')
        return response
        
    token = request.cookies.get('auth_token')
    # أيضًا فحص التوكن من هيدر Authorization
    if not token and 'Authorization' in request.headers:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1]
            
    if not token:
        print("[AUTH] No token provided in request")
        return jsonify({
            'isAuthenticated': False, 
            'valid': False, 
            'message': 'No token provided'
        }), 401

    try:
        user_data = verify_auth_token(token)
        
        # التحقق من أن البيانات غير فارغة
        if user_data is None:
            print("[AUTH] Invalid or expired token")
            return jsonify({
                'isAuthenticated': False,
                'valid': False, 
                'message': 'Invalid or expired token'
            }), 401
            
        # تحديث حالة المستخدم
        user_id = user_data.get('user_id') or user_data.get('sub')
        if user_id:
            update_user_status(user_id)
            
            # البحث عن المستخدم في قاعدة البيانات للحصول على بيانات إضافية
            try:
                user_obj = users_collection.find_one({"_id": ObjectId(user_id)})
                
                if user_obj:
                    # التأكد من وجود صورة المستخدم وإضافتها
                    avatar = user_obj.get('avatar', '')
                    print(f"[AUTH] User avatar: {avatar}")
                    
                    # إعداد استجابة كاملة بجميع بيانات المستخدم المطلوبة
                    response_data = {
                        'isAuthenticated': True,
                        'valid': True,
                        'user': {
                            'id': str(user_id),
                            'username': user_obj.get('username', user_data.get('username', '')),
                            'email': user_obj.get('email', user_data.get('email', '')),
                            'avatar': avatar,
                            'auth_provider': user_obj.get('auth_provider', 'unknown'),
                            'is_owner': user_obj.get('is_owner', user_data.get('is_owner', False)),
                            'is_booster': user_obj.get('is_booster', user_data.get('is_booster', False)),
                            'online': True
                        }
                    }
                    
                    print(f"[AUTH] Sending user data: {response_data}")
                    
                    # إنشاء توكن جديد لتجديد مدة الصلاحية
                    new_token = generate_token(user_id)
                    
                    # إعداد الاستجابة مع الكوكيز المحدثة
                    response = jsonify(response_data)
                    set_auth_cookies(response, new_token, COOKIE_MAX_AGE)
                    return response
            except Exception as e:
                print(f"[AUTH] Error finding user data: {str(e)}")
        
        # استجابة بسيطة في حالة عدم وجود بيانات إضافية
        print("[AUTH] Fallback user data from token")
        response_data = {
            'isAuthenticated': True,
            'valid': True,
            'user': {
                'id': str(user_id) if user_id else '',
                'username': user_data.get('username', ''),
                'email': user_data.get('email', ''),
                'avatar': user_data.get('avatar', ''), # التأكد من تضمين الصورة من التوكن أيضًا
                'is_owner': user_data.get('is_owner', False),
                'is_booster': user_data.get('is_booster', False)
            }
        }
        
        # تجديد التوكن
        if user_id:
            new_token = generate_token(user_id)
            response = jsonify(response_data)
            set_auth_cookies(response, new_token, COOKIE_MAX_AGE)
            return response
            
        return jsonify(response_data)
    except Exception as e:
        # تسجيل الخطأ وإعادة استجابة الفشل
        print(f"[AUTH] Auth check error: {str(e)}")
        return jsonify({
            'isAuthenticated': False, 
            'valid': False, 
            'message': f'Authentication failed: {str(e)}'
        }), 401

# مجموعة للاحتفاظ بقائمة المستخدمين المتصلين حاليًا
ONLINE_USERS = {}  # {"user_id": {"last_active": timestamp}}

def update_user_status(user_id, status=True):
    """تحديث حالة المستخدم (متصل/غير متصل)
    status=True للمتصل، status=False لغير المتصل"""
    if status:
        ONLINE_USERS[str(user_id)] = {"last_active": time.time()}
    elif str(user_id) in ONLINE_USERS:
        del ONLINE_USERS[str(user_id)]
    return True

def is_user_online(user_id):
    """التحقق ما إذا كان المستخدم متصلاً حاليًا"""
    user_id = str(user_id)
    if user_id in ONLINE_USERS:
        # اعتبر المستخدم غير متصل إذا كان آخر نشاط له منذ أكثر من 5 دقائق
        if time.time() - ONLINE_USERS[user_id]["last_active"] > 300:  # 5 دقائق
            del ONLINE_USERS[user_id]
            return False
        return True
    return False

# تعديل وظيفة verify_auth_token لتحديث حالة المستخدم
def verify_auth_token(token):
    """التحقق من صحة رمز المصادقة JWT"""
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        # تحديث حالة المستخدم كمتصل
        update_user_status(data.get('user_id'), True)
        
        return data
    except jwt.ExpiredSignatureError:
        # لا داعي لطباعة رسالة لكل توكن منتهي الصلاحية
        return None
    except jwt.InvalidTokenError:
        # لا داعي لطباعة رسالة لكل توكن غير صالح
        return None

@auth_bp.route('/status/<user_id>', methods=['GET'])
def user_status(user_id):
    """الحصول على حالة المستخدم (متصل/غير متصل)"""
    online = is_user_online(user_id)
    return jsonify({
        "user_id": user_id,
        "online": online,
        "timestamp": datetime.datetime.now().isoformat()
    })

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_user_profile():
    """الحصول على معلومات المستخدم الحالي"""
    user_id = g.user.get('user_id')
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    
    if user:
        # تحديث وقت آخر نشاط
        update_user_status(user_id, True)
        
        # تحويل _id من ObjectId إلى سلسلة نصية
        user['_id'] = str(user['_id'])
        # إزالة كلمة المرور من البيانات المُرجعة إن وجدت
        if 'password' in user:
            del user['password']
        
        # إضافة حالة الاتصال
        user['online'] = True
        
        return jsonify(user)
    
    return jsonify({"error": "User not found"}), 404

# إعدادات جلسة المستخدم
SESSION_TIMEOUT = int(os.getenv('SESSION_TIMEOUT', '300'))  # وقت انتهاء الجلسة بالثواني (5 دقائق افتراضياً)

# تهيئة security module إذا كان متاحًا
try:
    from backend.security.security import initialize
    initialize(JWT_SECRET, users_collection, update_user_status)
    print("Initialized security module with auth settings")
except ImportError:
    print("Security module not available, using internal auth functions")
except Exception as e:
    print(f"Error initializing security module: {e}") 