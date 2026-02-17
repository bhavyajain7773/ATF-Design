
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CoursePage from './pages/CoursePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/AdminDashboard';
import CourseMaterialPage from './pages/CourseMaterialPage';
import { COURSES as INITIAL_COURSES } from './constants';
import { Course, Order, User } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<Course[]>([]);
  const [discount, setDiscount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // BOOTSTRAP: Load persistence layer with deep merging & strict validation
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('atf_cart');
      const savedUser = localStorage.getItem('atf_user');
      const savedOrders = localStorage.getItem('atf_orders');
      const savedUsersList = localStorage.getItem('atf_users_list');
      const savedCourses = localStorage.getItem('atf_courses');

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
      
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') setUser(parsed);
      }
      
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) setOrders(parsed);
      }
      
      if (savedUsersList) {
        const parsed = JSON.parse(savedUsersList);
        if (Array.isArray(parsed)) setRegisteredUsers(parsed);
      }

      let baseCourses = INITIAL_COURSES;
      if (savedCourses) {
        const parsedSavedCourses = JSON.parse(savedCourses);
        if (Array.isArray(parsedSavedCourses)) {
          baseCourses = INITIAL_COURSES.map(initial => {
            const saved = parsedSavedCourses.find((s: Course) => s.id === initial.id);
            return saved ? { ...initial, ...saved } : initial;
          });
        }
      }
      setCourses(baseCourses);
    } catch (e) {
      console.error("Critical Recovery Failure:", e);
      setCourses(INITIAL_COURSES);
    }
  }, []);

  // SAFE PERSISTENCE SYNC
  const safeSave = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage Error for ${key}:`, e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert("Storage Limit Exceeded: The video file you uploaded is too large to be saved permanently in this browser. It will work during this session, but may disappear after refresh.");
      }
    }
  };

  useEffect(() => { safeSave('atf_cart', cart); }, [cart]);
  useEffect(() => {
    if (user) safeSave('atf_user', user);
    else localStorage.removeItem('atf_user');
  }, [user]);
  useEffect(() => { safeSave('atf_orders', orders); }, [orders]);
  useEffect(() => { safeSave('atf_users_list', registeredUsers); }, [registeredUsers]);
  useEffect(() => { safeSave('atf_courses', courses); }, [courses]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPath]);

  const handleAddToCart = (course: Course) => {
    if (!user) {
      setCurrentPath('account');
      return;
    }
    const currentCart = Array.isArray(cart) ? cart : [];
    if (!currentCart.some(item => item.id === course.id)) {
      setCart([...currentCart, course]);
    }
    setCurrentPath('cart');
  };

  const handleRemoveFromCart = (id: string) => {
    const currentCart = Array.isArray(cart) ? cart : [];
    const newCart = currentCart.filter(item => item.id !== id);
    setCart(newCart);
    if (newCart.length === 0) setDiscount(0);
  };

  const handleCompleteOrder = (order: Order) => {
    const enhancedOrder = {
      ...order,
      userName: user?.name,
      userEmail: user?.email
    };
    setOrders(prev => Array.isArray(prev) ? [enhancedOrder, ...prev] : [enhancedOrder]);
    setCart([]);
    setDiscount(0);
  };

  const handleRegister = (newUser: User) => {
    const usersList = Array.isArray(registeredUsers) ? registeredUsers : [];
    const exists = usersList.find(u => u.email === newUser.email);
    if (exists) return { success: false, message: "This email is already registered." };
    setRegisteredUsers(prev => Array.isArray(prev) ? [...prev, newUser] : [newUser]);
    setUser(newUser);
    return { success: true };
  };

  const handleLogin = (email: string, pass: string) => {
    const usersList = Array.isArray(registeredUsers) ? registeredUsers : [];
    const foundUser = usersList.find(u => u.email === email);
    if (!foundUser) return { success: false, message: "No account found." };
    if (foundUser.password !== pass) return { success: false, message: "Incorrect password." };
    setUser(foundUser);
    return { success: true };
  };

  const handleAdminLogin = (id: string, pass: string): boolean => {
    if (id === 'Panipuri05' && pass === 'Panipuri05') {
      const adminUser: User = {
        id: 'ADMIN-PANIPURI',
        name: 'Academy Administrator',
        email: 'admin@atf.edu.in',
        phone: '+91 00000 00000',
        isAdmin: true
      };
      setUser(adminUser);
      setCurrentPath('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setDiscount(0);
    setCurrentPath('home');
  };

  const purgeDatabase = () => {
    if (window.confirm("CRITICAL: Erase all data?")) {
      setOrders([]);
      setRegisteredUsers([]);
      setCart([]);
      setDiscount(0);
      setCourses(INITIAL_COURSES);
      localStorage.clear();
      alert("Database cleared.");
    }
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => {
      const arr = Array.isArray(prev) ? prev : INITIAL_COURSES;
      return arr.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    });
  };

  const renderPage = () => {
    if (currentPath === 'admin' && user?.isAdmin) {
      return (
        <AdminDashboard 
          orders={Array.isArray(orders) ? orders : []} 
          users={Array.isArray(registeredUsers) ? registeredUsers : []}
          courses={Array.isArray(courses) ? courses : INITIAL_COURSES}
          onUpdateCourse={updateCourse}
          onNavigate={setCurrentPath} 
          onLogout={handleLogout} 
          onPurge={purgeDatabase}
        />
      );
    }

    if (currentPath === 'home') return <Home user={user} courses={courses} onNavigate={setCurrentPath} onAddToCart={handleAddToCart} />;
    if (currentPath === 'about') return <About />;
    if (currentPath === 'contact') return <Contact />;
    if (currentPath === 'cart') return <CartPage cart={Array.isArray(cart) ? cart : []} onRemove={handleRemoveFromCart} onNavigate={setCurrentPath} discount={discount} onApplyDiscount={setDiscount} />;
    if (currentPath === 'checkout') return <CheckoutPage cart={Array.isArray(cart) ? cart : []} user={user} discount={discount} onCompleteOrder={handleCompleteOrder} onNavigate={setCurrentPath} />;
    if (currentPath === 'account') return (
      <AccountPage 
        user={user} 
        orders={Array.isArray(orders) ? orders.filter(o => o.userEmail === user?.email) : []} 
        onLogin={handleLogin} 
        onRegister={handleRegister}
        onLogout={handleLogout}
        onAdminLogin={handleAdminLogin}
        onNavigate={setCurrentPath}
      />
    );
    
    if (currentPath.startsWith('course-')) {
      const courseId = currentPath.replace('course-', '');
      const course = courses.find(c => c.id === courseId);
      if (course) return <CoursePage user={user} course={course} onAddToCart={handleAddToCart} onNavigate={setCurrentPath} />;
    }

    if (currentPath.startsWith('material-')) {
      const courseId = currentPath.replace('material-', '');
      const course = courses.find(c => c.id === courseId);
      if (course) return <CourseMaterialPage course={course} onNavigate={setCurrentPath} />;
    }

    return <Home user={user} courses={courses} onNavigate={setCurrentPath} onAddToCart={handleAddToCart} />;
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-black selection:text-white relative">
      {currentPath !== 'admin' && !currentPath.startsWith('material-') && (
        <Navbar currentPath={currentPath} onNavigate={setCurrentPath} cartCount={cart.length} courses={courses} />
      )}
      <main className="flex-grow">{renderPage()}</main>
      {currentPath !== 'admin' && !currentPath.startsWith('material-') && (
        <footer className="bg-white border-t border-slate-100 py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="max-w-sm">
              <h2 className="text-4xl font-extrabold tracking-tighter mb-6">ATF.</h2>
              <p className="text-slate-400 font-medium leading-relaxed">Academy of Trade Finance.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
