
import React, { useState } from 'react';
import { User, Order } from '../types';
import { LogOut, Package, History, ExternalLink, UserCircle, Mail, MapPin, Key } from 'lucide-react';
import { ENROLLMENT_PORTAL } from '../constants';

interface AccountPageProps {
  user: User | null;
  orders: Order[];
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, orders, onLogin, onLogout }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onLogin({
      id: 'USR-' + Math.floor(Math.random() * 10000),
      name: formData.name || 'John Doe',
      email: formData.email,
      phone: '+91 99999 99999'
    });
  };

  if (!user) {
    return (
      <div className="pt-40 pb-20 px-6 min-h-screen bg-slate-50/50">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50">
            <header className="text-center mb-10">
              <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <UserCircle size={40} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter mb-2">
                {isRegister ? 'Create Profile.' : 'Welcome Back.'}
              </h1>
              <p className="text-slate-400 text-sm font-medium">Access your professional dashboard.</p>
            </header>

            <form onSubmit={handleAuth} className="space-y-6">
              {isRegister && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Jane Smith"
                    className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                <input 
                  required 
                  type="email" 
                  placeholder="jane@academy.edu"
                  className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Password</label>
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all transform active:scale-[0.98]"
              >
                {isRegister ? 'Initialize Account' : 'Secure Login'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs font-bold text-slate-400 hover:text-black uppercase tracking-widest transition-all"
              >
                {isRegister ? 'Already have an account? Login' : 'New to ATF? Register'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Profile Sidebar */}
          <aside className="md:w-1/3 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{user.name}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">ID: {user.id}</p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 text-slate-600">
                  <Mail size={18} className="text-slate-300" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <MapPin size={18} className="text-slate-300" />
                  <span className="text-sm font-medium">Jodhpur, Rajasthan</span>
                </div>
              </div>

              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all text-xs uppercase tracking-widest"
              >
                <LogOut size={16} /> Secure Logout
              </button>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">Certification Status</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Progress tracked for global compliance readiness.</p>
                <div className="w-full h-2 bg-white/10 rounded-full mb-2">
                  <div className="w-1/4 h-full bg-white rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">25% Competency Score</p>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <History size={160} />
              </div>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="md:w-2/3 space-y-12">
            <section>
              <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center gap-4">
                <Package size={28} /> Program History & Tracking
              </h2>

              {orders.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <History size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium italic">No active enrollments found in your institutional record.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black">{order.id}</span>
                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Date: {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black">{order.total}Rs</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking: {order.trackingNumber}</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-black border border-slate-100">
                              {item.level.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{item.title}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <a 
                          href={ENROLLMENT_PORTAL}
                          className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest hover:opacity-70 transition-opacity"
                        >
                          Launch Course Material <ExternalLink size={14} />
                        </a>
                        <button className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-black transition-colors">
                          Download Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-12">
              <h2 className="text-2xl font-bold mb-6">Learning Path Advice</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Based on your current enrollment, we suggest completing the "International Trade Finance" fundamentals before moving into advanced Risk Management layers. 
                Your institutional progress is being monitored by our SEBI-aligned mentor team.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-500">UCP 600 Ready</div>
                <div className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-500">Forex Pending</div>
                <div className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-500">KYC Verified</div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
