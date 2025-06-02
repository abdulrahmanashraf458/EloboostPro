from flask import Blueprint, request, jsonify, make_response
from .security import verify_auth_token, secure_api_endpoint
from .routes import get_route_permission

# إنشاء Blueprint للمسارات المتعلقة بالأمان
security_bp = Blueprint('security_bp', __name__)

@security_bp.route('/check-role', methods=['GET'])
@secure_api_endpoint
def check_role():
    """
    التحقق من دور المستخدم الحالي
    """
    # الحصول على بيانات المستخدم من توثيق الطلب
    user_data = request.user_data
    
    # تحديد دور المستخدم
    user_role = 'anonymous'
    if user_data:
        if user_data.get('is_owner'):
            user_role = 'owner'
        elif user_data.get('is_booster'):
            user_role = 'booster'
        else:
            user_role = 'client'
    
    # إعداد استجابة بدور المستخدم
    response = {
        'id': str(user_data['_id']) if user_data else None,
        'username': user_data.get('username') if user_data else None,
        'is_owner': user_data.get('is_owner', False) if user_data else False,
        'is_booster': user_data.get('is_booster', False) if user_data else False,
        'role': user_role
    }
    
    return jsonify(response)

@security_bp.route('/access-check/<path:route_path>', methods=['GET'])
@secure_api_endpoint
def access_check(route_path):
    """
    التحقق من صلاحية الوصول لمسار معين
    
    Args:
        route_path (str): مسار الصفحة المراد التحقق من الصلاحية للوصول إليه
    """
    # الحصول على بيانات المستخدم من توثيق الطلب
    user_data = request.user_data
    
    # تحديد دور المستخدم
    user_role = 'anonymous'
    if user_data:
        if user_data.get('is_owner'):
            user_role = 'owner'
        elif user_data.get('is_booster'):
            user_role = 'booster'
        else:
            user_role = 'client'
    
    # الحصول على الصلاحية المطلوبة للمسار
    required_role = get_route_permission(route_path)
    
    # التحقق من الصلاحية
    access_granted = False
    
    # إذا كان المسار يسمح للجميع بالوصول
    if required_role is None:
        access_granted = True
    
    # إذا كان دور المستخدم مطابقًا للدور المطلوب
    elif user_role == required_role:
        access_granted = True
    
    # إعداد استجابة
    response = {
        'access_granted': access_granted,
        'user_role': user_role,
        'required_role': required_role,
        'route_path': route_path
    }
    
    return jsonify(response)

def register_security_endpoints(app, url_prefix='/api/security'):
    """
    تسجيل نقاط نهاية API الأمان مع تطبيق Flask
    
    Args:
        app: تطبيق Flask
        url_prefix: بادئة عنوان URL لمسارات API (افتراضيًا: /api/security)
    """
    app.register_blueprint(security_bp, url_prefix=url_prefix) 