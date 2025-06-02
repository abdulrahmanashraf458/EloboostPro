"""
ملف تكوين الوجهات والصلاحيات للوصول
"""

# Dictionary of route paths and their required roles
ROUTE_PERMISSIONS = {
    # الصفحات العامة (يمكن للجميع الوصول إليها)
    '': None,                     # الصفحة الرئيسية
    'login': None,                # صفحة تسجيل الدخول
    'register': None,             # صفحة التسجيل
    
    # صفحات المالك
    'owner': 'owner',             # لوحة تحكم المالك
    'owner/dashboard': 'owner',   # لوحة تحكم المالك
    'owner/settings': 'owner',    # إعدادات المالك
    'owner/users': 'owner',       # إدارة المستخدمين
    'owner/boosters': 'owner',    # إدارة المعززين
    'owner/clients': 'owner',     # إدارة العملاء
    'owner/orders': 'owner',      # طلبات المالك
    'owner/payments': 'owner',    # مدفوعات المالك
    'owner/reports': 'owner',     # تقارير المالك
    
    # صفحات المعزز
    'booster': 'booster',         # لوحة تحكم المعزز
    'booster/dashboard': 'booster',    # لوحة تحكم المعزز
    'booster/orders': 'booster',       # طلبات المعزز
    'booster/settings': 'booster',     # إعدادات المعزز
    'booster/earnings': 'booster',     # أرباح المعزز
    'booster/appointments': 'booster', # مواعيد المعزز
    
    # صفحات العميل
    'dashboard': 'client',         # لوحة تحكم العميل
    'profile': 'client',           # ملف المستخدم
    'settings': 'client',          # إعدادات المستخدم
    'orders': 'client',            # طلبات المستخدم
    'order/new': 'client',         # طلب جديد
    'payment': 'client',           # الدفع
    'contact': 'client',           # اتصل بنا
    'account': 'client',           # حسابي
}

# API permissions
API_PERMISSIONS = {
    # مسارات API العامة
    'api/auth/login': None,
    'api/auth/register': None,
    'api/auth/logout': None,
    'api/auth/check-token': None,
    'api/security/check-role': None,
    
    # مسارات API للمالك
    'api/owner/users': 'owner',
    'api/owner/boosters': 'owner',
    'api/owner/clients': 'owner',
    'api/owner/orders': 'owner',
    'api/owner/reports': 'owner',
    'api/owner/statistics': 'owner',
    'api/owner/settings': 'owner',
    
    # مسارات API للمعزز
    'api/booster/profile': 'booster',
    'api/booster/orders': 'booster',
    'api/booster/availability': 'booster',
    'api/booster/earnings': 'booster',
    'api/booster/appointments': 'booster',
    
    # مسارات API للعميل
    'api/client/profile': 'client',
    'api/client/orders': 'client',
    'api/client/payments': 'client',
}

def get_route_permission(route_path):
    """
    تحديد الصلاحية المطلوبة للوصول إلى مسار معين
    
    Args:
        route_path (str): مسار الصفحة أو API
        
    Returns:
        str or None: الدور المطلوب للوصول أو None إذا كان مسارًا عامًا
    """
    # تنظيف المسار
    route_path = route_path.strip('/')
    
    # التحقق مما إذا كان المسار في تكوين مسارات الصفحات
    if route_path in ROUTE_PERMISSIONS:
        return ROUTE_PERMISSIONS[route_path]
    
    # التحقق مما إذا كان المسار في تكوين مسارات API
    if route_path in API_PERMISSIONS:
        return API_PERMISSIONS[route_path]
    
    # التعامل مع مسارات API الديناميكية
    for api_path, role in API_PERMISSIONS.items():
        if api_path.endswith('/*'):
            base_path = api_path[:-2]  # إزالة '/*'
            if route_path.startswith(base_path):
                return role
    
    # إذا لم يتم العثور على مطابقة، اعتبره صفحة عامة
    return None 