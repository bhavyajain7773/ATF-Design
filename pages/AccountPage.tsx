
import React, { useState } from 'react';
import { User, Order } from '../types';
import { LogOut, Package, History, UserCircle, Mail, MapPin, ShieldAlert, MonitorPlay, AlertCircle } from 'lucide-react';

interface AccountPageProps {
  user: User | null;
  orders: Order[];
  onLogin: (email: string, pass: string) => { success: boolean, message?: string };
  onRegister: (user: User) => { success: boolean, message?: string };
  onLogout: () => void;
  onAdminLogin: (id: string, pass: string) => boolean;
  onNavigate: (path: string) => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, orders, onLogin, onRegister, onLogout, onAdminLogin, onNavigate }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', adminId: '', adminPass: '' });
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAdminMode) {
      const success = onAdminLogin(formData.adminId, formData.adminPass);
      if (!success) setError('Invalid Institutional Admin Credentials');
      return;
    }

    if (isRegister) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const result = onRegister({
        id: 'USR-' + Math.floor(Math.random() * 100000),
        name: formData.name,
        email: formData.email,
        phone: '+91 00000 00000',
        password: formData.password
      });
      if (!result.success) setError(result.message || 'Registration failed.');
    } else {
      const result = onLogin(formData.email, formData.password);
      if (!result.success) {
        setError(result.message || 'Authentication failed.');
      }
    }
  };

  if (!user) {
    return (
      <div className="pt-40 pb-20 px-6 min-h-screen bg-slate-50/50">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50">
            <header className="text-center mb-10">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-colors duration-500 ${
                isAdminMode ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-slate-900 text-white'
              }`}>
                {isAdminMode ? <ShieldAlert size={40} /> : <UserCircle size={40} />}
              </div>
              <h1 className="text-3xl font-black tracking-tighter mb-2">
                {isAdminMode ? 'Institutional Command.' : isRegister ? 'Join the Academy.' : 'Welcome Back.'}
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                {isAdminMode ? 'Authorized personnel only.' : isRegister ? 'Create your professional profile.' : 'Please enter your credentials.'}
              </p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-[11px] font-bold flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {!isAdminMode ? (
                <>
                  {isRegister && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Legal Name</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Jane Doe"
                        className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="name@institution.com"
                      className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5"
                      value={formData.email}
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
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Admin Identifier</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="PanipuriID"
                      className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/10"
                      onChange={e => setFormData({...formData, adminId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Security Passkey</label>
                    <input 
                      required 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500/10"
                      onChange={e => setFormData({...formData, adminPass: e.target.value})}
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                className={`w-full py-5 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-lg ${
                  isAdminMode ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-100' : 'bg-black text-white hover:bg-slate-800 shadow-slate-200'
                }`}
              >
                {isAdminMode ? 'Verify Authority' : isRegister ? 'Create My Account' : 'Sign In Securely'}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button 
                onClick={() => { setIsRegister(!isRegister); setIsAdminMode(false); setError(''); }}
                className="text-[10px] font-bold text-slate-400 hover:text-black uppercase tracking-widest transition-all"
              >
                {!isAdminMode && (isRegister ? 'Existing member? Login' : 'No account yet? Register first')}
              </button>
              
              <button 
                onClick={() => { setIsAdminMode(!isAdminMode); setIsRegister(false); setError(''); }}
                className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all px-6 py-2 rounded-full border ${
                  isAdminMode ? 'text-black border-black' : 'text-slate-200 border-slate-100 hover:text-slate-500 hover:border-slate-200'
                }`}
              >
                {isAdminMode ? 'Exit Admin View' : 'Administrator Portal'}
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
          <aside className="md:w-1/3 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{user.name}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Student ID: {user.id}</p>
                </div>
              </div>
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 text-slate-600">
                  <Mail size={18} className="text-slate-300" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <MapPin size={18} className="text-slate-300" />
                  <span className="text-sm font-medium">Jodhpur Campus</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all text-xs uppercase tracking-widest"
              >
                <LogOut size={16} /> Logout Session
              </button>
            </div>
          </aside>
          <main className="md:w-2/3 space-y-12">
            <section>
              <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center gap-4">
                <Package size={28} /> My Enrollments
              </h2>
              {orders.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <History size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium italic">You are not enrolled in any programs yet.</p>
                  <button onClick={() => onNavigate('home')} className="mt-6 text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4">Browse Programs</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black text-slate-300">{order.id}</span>
                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold uppercase tracking-widest rounded-full">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black">{order.total}Rs</p>
                        </div>
                      </div>
                      <div className="space-y-4 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/item">
                            <span className="text-sm font-bold text-slate-800">{item.title}</span>
                            <button 
                              onClick={() => onNavigate(`material-${item.id}`)}
                              className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                            >
                              <MonitorPlay size={12} /> Access Material
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
