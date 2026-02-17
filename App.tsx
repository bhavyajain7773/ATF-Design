
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

  // BOOTSTRAP: Load persistence layer with deep merging
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('atf_cart');
      const savedUser = localStorage.getItem('atf_user');
      const savedOrders = localStorage.getItem('atf_orders');
      const savedUsersList = localStorage.getItem('atf_users_list');
      const savedCourses = localStorage.getItem('atf_courses');

      // 1. Restore Students & Orders (Pure persistence)
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedUsersList) setRegisteredUsers(JSON.parse(savedUsersList));

      // 2. Intelligent Course Merging
      // This prevents "Content Manager" data from being erased by code updates
      if (savedCourses) {
        const parsedSavedCourses = JSON.parse(savedCourses) as Course[];
        const mergedCourses = INITIAL_COURSES.map(initial => {
          const saved = parsedSavedCourses.find(s => s.id === initial.id);
          // If we have a saved version, keep the Admin's videos/quizzes
          return saved ? { ...initial, ...saved } : initial;
        });
        setCourses(mergedCourses);
      } else {
        setCourses(INITIAL_COURSES);
      }
    } catch (e) {
      console.error("Critical Recovery Failure: Data may be corrupted.", e);
      setCourses(INITIAL_COURSES);
    }
  }, []);

  // PERSISTENCE SYNC (Triggered on every state change)
  useEffect(() => { localStorage.setItem('atf_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (user) localStorage.setItem('atf_user', JSON.stringify(user));
    else localStorage.removeItem('atf_user');
  }, [user]);
  useEffect(() => { localStorage.setItem('atf_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('atf_users_list', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('atf_courses', JSON.stringify(courses)); }, [courses]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPath]);

  const handleAddToCart = (course: Course) => {
    if (!user) {
      setCurrentPath('account');
      return;
    }
    if (!cart.some(item => item.id === course.id)) {
      setCart([...cart, course]);
    }
    setCurrentPath('cart');
  };

  const handleRemoveFromCart = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    if (newCart.length === 0) setDiscount(0);
  };

  const handleCompleteOrder = (order: Order) => {
    const enhancedOrder = {
      ...order,
      userName: user?.name,
      userEmail: user?.email
    };
    setOrders(prev => [enhancedOrder, ...prev]);
    setCart([]);
    setDiscount(0);
  };

  const handleRegister = (newUser: User) => {
    const exists = registeredUsers.find(u => u.email === newUser.email);
    if (exists) return { success: false, message: "This email is already registered." };
    
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const handleLogin = (email: string, pass: string) => {
    const foundUser = registeredUsers.find(u => u.email === email);
    
    // Check if user exists at all
    if (!foundUser) {
      return { 
        success: false, 
        message: "No account found with this email. Please Register first." 
      };
    }
    
    // Check password integrity
    if (foundUser.password !== pass) {
      return { 
        success: false, 
        message: "Incorrect password. Please try again." 
      };
    }
    
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
    if (window.confirm("CRITICAL: Erase all student data, orders, and content manager updates? This cannot be undone.")) {
      setOrders([]);
      setRegisteredUsers([]);
      setCart([]);
      setDiscount(0);
      setCourses(INITIAL_COURSES);
      localStorage.clear();
      alert("Institutional Database has been cleared.");
    }
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const renderPage = () => {
    if (currentPath === 'admin' && user?.isAdmin) {
      return (
        <AdminDashboard 
          orders={orders} 
          users={registeredUsers}
          courses={courses}
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
    if (currentPath === 'cart') return <CartPage cart={cart} onRemove={handleRemoveFromCart} onNavigate={setCurrentPath} discount={discount} onApplyDiscount={setDiscount} />;
    if (currentPath === 'checkout') return <CheckoutPage cart={cart} user={user} discount={discount} onCompleteOrder={handleCompleteOrder} onNavigate={setCurrentPath} />;
    if (currentPath === 'account') return (
      <AccountPage 
        user={user} 
        orders={orders.filter(o => o.userEmail === user?.email)} 
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
              <p className="text-slate-400 font-medium leading-relaxed">Academy of Trade Finance. A premier institutional bridge for masters of global capital.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-6">Explore</h4>
                <ul className="space-y-3 text-sm font-semibold text-slate-600">
                  <li><button onClick={() => setCurrentPath('home')} className="hover:text-black">Catalog</button></li>
                  <li><button onClick={() => setCurrentPath('about')} className="hover:text-black">Methodology</button></li>
                  <li><button onClick={() => setCurrentPath('account')} className="hover:text-black">Student Portal</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-6">Governance</h4>
                <ul className="space-y-3 text-sm font-semibold text-slate-600">
                  <li>Privacy Protocols</li>
                  <li>Terms of Mastery</li>
                  <li><button onClick={() => setCurrentPath('account')} className="text-slate-300 hover:text-black transition-colors">Admin Hub</button></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
