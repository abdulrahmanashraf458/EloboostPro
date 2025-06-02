import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RequireRoleProps {
  children: JSX.Element;
  role: 'owner' | 'booster' | 'client';
}

const RequireRole: React.FC<RequireRoleProps> = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  // التحقق من الصلاحيات باستخدام API الأمان
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // استخراج المسار الحالي
      const currentPath = location.pathname.replace(/^\/+/, '');
      
      // استخدام API للتحقق من صلاحية الوصول
      fetch(`/api/security/access-check/${currentPath}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Security check result:', data);
        setAccessGranted(data.access_granted);
        setAccessChecked(true);
        
        // إذا لم يكن لديه صلاحية الوصول، قم بإعادة توجيهه
        if (!data.access_granted) {
          // التحقق من دور المستخدم وإعادة التوجيه للصفحة المناسبة
          if (data.user_role === 'owner') {
            navigate('/owner');
          } else if (data.user_role === 'booster') {
            navigate('/booster');
          } else {
            navigate('/dashboard');
          }
        }
      })
      .catch(error => {
        console.error('Security check error:', error);
        setAccessChecked(true);
        setAccessGranted(false);
      });
    } else if (!loading && !isAuthenticated) {
      setAccessChecked(true);
      setAccessGranted(false);
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  // التحقق المبدئي من الصلاحيات مباشرة (قبل استجابة API)
  const hasCorrectRole = () => {
    if (role === 'owner') {
      return user?.is_owner === true;
    } else if (role === 'booster') {
      return user?.is_booster === true;
    } else if (role === 'client') {
      return !user?.is_owner && !user?.is_booster;
    }
    return false;
  };

  // إذا لا يزال التحميل جاريًا، أظهر شاشة تحميل
  if (loading) {
    return null;  // أو شاشة تحميل
  }

  // إذا غير مسجل، قم بإعادة التوجيه إلى الصفحة الرئيسية
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // إذا تم التحقق من الصلاحيات بواسطة API، اتبع نتيجة التحقق
  if (accessChecked) {
    if (accessGranted) {
      return children;
    } else {
      // سيتم التعامل مع إعادة التوجيه في useEffect
      return null;
    }
  }

  // التحقق المبدئي (قبل استجابة API)
  if (hasCorrectRole()) {
    return children;
  }

  // إعادة التوجيه حسب دور المستخدم
  if (user?.is_owner) {
    return <Navigate to="/owner" replace />;
  } else if (user?.is_booster) {
    return <Navigate to="/booster" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default RequireRole; 