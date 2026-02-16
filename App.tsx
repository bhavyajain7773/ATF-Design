
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
import { COURSES } from './constants';
import { Course, Order, User } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  // Initialize state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('atf_cart');
      const savedUser = localStorage.getItem('atf_user');
      const savedOrders = localStorage.getItem('atf_orders');
      const savedUsersList = localStorage.getItem('atf_users_list');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedUsersList) setRegisteredUsers(JSON.parse(savedUsersList));
    } catch (e) {
      console.error("Failed to load persistence layer", e);
    }
  }, []);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('atf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) localStorage.setItem('atf_user', JSON.stringify(user));
    else localStorage.removeItem('atf_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('atf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atf_users_list', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

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
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCompleteOrder = (order: Order) => {
    const enhancedOrder = {
      ...order,
      userName: user?.name,
      userEmail: user?.email
    };
    setOrders(prev => [enhancedOrder, ...prev]);
    setCart([]);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    // Persist to global directory (simulate database registration)
    setRegisteredUsers(prev => {
      const exists = prev.find(u => u.email === newUser.email);
      if (!exists) {
        return [...prev, newUser];
      }
      return prev;
    });
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
    // Only clear the session and current cart
    // Keep registeredUsers and orders so they are "saved" for the Admin
    setUser(null);
    setCart([]);
    setCurrentPath('home');
  };

  const purgeDatabase = () => {
    // This is the "Everything is empty" master switch requested
    setOrders([]);
    setRegisteredUsers([]);
    setCart([]);
    localStorage.removeItem('atf_orders');
    localStorage.removeItem('atf_users_list');
    localStorage.removeItem('atf_cart');
    alert("Institutional Database has been purged.");
  };

  const renderPage = () => {
    if (currentPath === 'admin' && user?.isAdmin) {
      return (
        <AdminDashboard 
          orders={orders} 
          users={registeredUsers}
          onNavigate={setCurrentPath} 
          onLogout={handleLogout} 
          onPurge={purgeDatabase}
        />
      );
    }

    if (currentPath === 'home') return <Home user={user} onNavigate={setCurrentPath} onAddToCart={handleAddToCart} />;
    if (currentPath === 'about') return <About />;
    if (currentPath === 'contact') return <Contact />;
    if (currentPath === 'cart') return <CartPage cart={cart} onRemove={handleRemoveFromCart} onNavigate={setCurrentPath} />;
    if (currentPath === 'checkout') return (
      <CheckoutPage 
        cart={cart} 
        user={user} 
        onCompleteOrder={handleCompleteOrder} 
        onNavigate={setCurrentPath} 
      />
    );
    if (currentPath === 'account') return (
      <AccountPage 
        user={user} 
        orders={orders.filter(o => o.userEmail === user?.email)} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        onAdminLogin={handleAdminLogin}
      />
    );
    
    if (currentPath.startsWith('course-')) {
      const courseId = currentPath.replace('course-', '');
      const course = COURSES.find(c => c.id === courseId);
      if (course) return (
        <CoursePage 
          user={user}
          course={course} 
          onAddToCart={handleAddToCart} 
          onNavigate={setCurrentPath}
        />
      );
    }

    return <Home user={user} onNavigate={setCurrentPath} onAddToCart={handleAddToCart} />;
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-black selection:text-white relative">
      {currentPath !== 'admin' && (
        <Navbar 
          currentPath={currentPath} 
          onNavigate={setCurrentPath} 
          cartCount={cart.length} 
        />
      )}
      <main className="flex-grow">{renderPage()}</main>
      {currentPath !== 'admin' && (
        <footer className="bg-white border-t border-slate-100 py-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="max-w-sm">
              <h2 className="text-4xl font-extrabold tracking-tighter mb-6">ATF.</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Academy of Trade Finance. A premier institutional bridge for masters of global capital, operating from Jodhpur to the world.
              </p>
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
              <div className="hidden md:block">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-6">Frameworks</h4>
                <ul className="space-y-3 text-sm font-semibold text-slate-600">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-black"></div> UCP 600</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> SWIFT v8</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div> ISBP 745</li>
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
