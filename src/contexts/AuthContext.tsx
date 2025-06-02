import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

// تعريف نوع المستخدم
export interface User {
  id: string;
  username: string;
  email?: string;  // جعل البريد الإلكتروني اختياري
  avatar?: string;
  auth_provider?: string;
  online?: boolean;
  last_login?: string;
  is_owner: boolean;
  is_booster: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithGoogle: () => void;
  loginWithDiscord: () => void;
  logout: () => Promise<void>;
  refreshUserStatus: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'auth_user_data';
const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_TIMESTAMP_KEY = 'auth_last_check';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // حفظ بيانات المستخدم في localStorage
  const saveUserToStorage = useCallback((userData: User | null) => {
    try {
      if (userData) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
      }
    } catch (e) {
      console.error('Failed to save user data to localStorage:', e);
    }
  }, []);

  // حفظ التوكن في localStorage
  const saveTokenToStorage = useCallback((token: string | null) => {
    try {
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } catch (e) {
      console.error('Failed to save token to localStorage:', e);
    }
  }, []);

  // استرجاع التوكن من localStorage
  const getTokenFromStorage = useCallback((): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.error('Failed to get token from localStorage:', e);
      return null;
    }
  }, []);

  // استرجاع بيانات المستخدم من localStorage
  const getUserFromStorage = useCallback((): User | null => {
    try {
      const userData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (e) {
      console.error('Failed to get user data from localStorage:', e);
      return null;
    }
  }, []);

  // دالة التحقق من حالة المصادقة
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/check-token', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // إذا كان الرد ليس 2xx، فلا داعي لقراءة البيانات
      if (!response.ok) {
        // لا نسجل الخطأ 401 لأنه متوقع عندما لا يكون المستخدم مسجل دخول
        if (response.status !== 401) {
          console.error(`Authentication check error: ${response.status}`);
        }
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log("Auth response:", data); // سجل استجابة التحقق لأغراض التشخيص
      
      if (data.valid || data.isAuthenticated) {
        // استخراج بيانات المستخدم مع تضمين الصورة
        const userData: User = {
          id: data.id || (data.user && data.user.id) || '',
          username: data.username || (data.user && data.user.username) || 'User',
          email: data.email || (data.user && data.user.email) || '',
          avatar: data.avatar || (data.user && data.user.avatar) || '',
          auth_provider: data.auth_provider || (data.user && data.user.auth_provider) || 'unknown',
          is_owner: data.is_owner || (data.user && data.user.is_owner) || false,
          is_booster: data.is_booster || (data.user && data.user.is_booster) || false
        };
        
        console.log("User data extracted:", userData); // سجل بيانات المستخدم المستخرجة
        
        setUser(userData);
        setIsAuthenticated(true);
        // تحديث التخزين المحلي بعد نجاح التحقق
        saveUserToStorage(userData);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        // مسح التخزين المحلي
        saveUserToStorage(null);
      }
    } catch (error) {
      // سجل الخطأ فقط إذا كان هناك خطأ في الشبكة
      console.error('Network error during authentication check:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [saveUserToStorage]);

  // تحديث حالة المستخدم
  const refreshUserStatus = useCallback(async () => {
    await checkAuthStatus();
  }, [checkAuthStatus]);

  // معالجة التزامن بين التابات
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        try {
          const userData = event.newValue ? JSON.parse(event.newValue) : null;
          setUser(userData);
        } catch (e) {
          console.error('Error parsing user data from storage event:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // التحقق من التوثيق عند بدء التشغيل
  useEffect(() => {
    // محاولة استخدام البيانات المحلية أولاً لتسريع العرض
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    
    // التحقق من الخادم
    checkAuthStatus();
    
    // تحديث دوري فقط إذا كان المستخدم مسجل دخول
    // استخدام متغير لتتبع عدد مرات الفشل المتتالية
    let failedAttempts = 0;
    const MAX_FAILED_ATTEMPTS = 3;
    
    const intervalId = setInterval(() => {
      // تحقق فقط إذا كان هناك مستخدم مسجل أو عدد محاولات الفشل أقل من الحد الأقصى
      if (isAuthenticated || failedAttempts < MAX_FAILED_ATTEMPTS) {
        checkAuthStatus().then(() => {
          // إعادة تعيين عدد المحاولات الفاشلة إذا نجحت العملية
          if (isAuthenticated) {
            failedAttempts = 0;
          } else {
            // زيادة عدد المحاولات الفاشلة
            failedAttempts++;
            
            // إيقاف التحقق المتكرر بعد وصول الحد الأقصى من المحاولات الفاشلة
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
              console.log('Pausing auth checks after multiple failed attempts');
            }
          }
        });
      }
    }, 300000); // زيادة الفترة إلى 5 دقائق بدلاً من دقيقة واحدة
    
    return () => clearInterval(intervalId);
  }, [checkAuthStatus, getUserFromStorage, isAuthenticated]);

  // وظائف تسجيل الدخول
  const loginWithDiscord = () => {
    // تخزين URL الحالي للرجوع إليه بعد تسجيل الدخول
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/') {
      sessionStorage.setItem('auth_redirect', currentPath);
    }
    window.location.href = '/api/auth/discord/login';
  };

  const loginWithGoogle = () => {
    // تخزين URL الحالي للرجوع إليه بعد تسجيل الدخول
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/') {
      sessionStorage.setItem('auth_redirect', currentPath);
    }
    window.location.href = '/api/auth/google/login';
  };

  // تسجيل الخروج
  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // بغض النظر عن الاستجابة، نقوم بتنظيف حالة المستخدم محليًا
      setUser(null);
      setIsAuthenticated(false);  // تعيين حالة المصادقة إلى false صراحة
      
      // تنظيف التخزين المحلي
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
      
      // مسح ملفات تعريف الارتباط بشكل صريح
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      if (!response.ok) {
        console.warn('Logout API response was not OK, but client state has been cleared anyway');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // حتى في حالة الخطأ، نمسح بيانات المستخدم محليًا
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    loginWithGoogle,
    loginWithDiscord,
    logout,
    refreshUserStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 