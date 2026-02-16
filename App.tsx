
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

  // Initialize state from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('atf_cart');
    const savedUser = localStorage.getItem('atf_user');
    const savedOrders = localStorage.getItem('atf_orders');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Persist state to LocalStorage
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  const handleAddToCart = (course: Course) => {
    // Check if user is logged in before allowing enrollment
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
    setOrders([order, ...orders]);
    setCart([]); // Clear cart after success
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleAdminLogin = (id: string, pass: string): boolean => {
    // Updated credentials as per user request
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
    setCurrentPath('home');
  };

  const renderPage = () => {
    // Admin Override
    if (currentPath === 'admin' && user?.isAdmin) {
      return (
        <AdminDashboard 
          orders={orders} 
          onNavigate={setCurrentPath} 
          onLogout={handleLogout} 
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
        orders={orders.filter(o => o.userId === user?.id || o.userId === 'guest')} 
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
      {/* Conditionally hide Navbar in Admin view for a full-screen app feel */}
      {currentPath !== 'admin' && (
        <Navbar 
          currentPath={currentPath} 
          onNavigate={setCurrentPath} 
          cartCount={cart.length} 
        />
      )}
      
      <main className="flex-grow">
        {renderPage()}
      </main>
      
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
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] flex flex-col sm:flex-row justify-between gap-6">
            <p>© {new Date().getFullYear()} Academy of Trade Finance. All Rights Reserved.</p>
            <div className="flex gap-8">
              <p>18, Shastri Circle, Jodhpur</p>
              <p>contact@atf.edu.in</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
