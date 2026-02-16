
import React, { useMemo, useState } from 'react';
import { Order, User, AdminStats } from '../types';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowLeft, 
  Search,
  Database,
  History,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  users: User[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onPurge: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, users, onNavigate, onLogout, onPurge }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders');

  const stats: AdminStats = useMemo(() => {
    const revenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const popularity: { [key: string]: number } = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        popularity[item.title] = (popularity[item.title] || 0) + 1;
      });
    });

    return {
      totalRevenue: revenue,
      totalOrders: orders.length,
      totalUsers: users.length,
      coursePopularity: popularity
    };
  }, [orders, users]);

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black tracking-tighter">ATF Central Command.</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onPurge}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors bg-red-50/50 px-4 py-2 rounded-full border border-red-100"
            >
              <AlertTriangle size={12} /> System Reset
            </button>
            <button 
              onClick={onLogout}
              className="text-xs font-bold text-slate-900 uppercase tracking-widest hover:bg-slate-50 px-4 py-2 rounded-xl transition-all"
            >
              Logout Session
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={24} /></div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black">{stats.totalRevenue}Rs</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><ShoppingBag size={24} /></div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Enrollments</p>
            <h3 className="text-3xl font-black">{stats.totalOrders}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Users size={24} /></div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Registered Users</p>
            <h3 className="text-3xl font-black">{stats.totalUsers}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Database size={24} /></div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Persisted Records</p>
            <h3 className="text-3xl font-black">{users.length + orders.length} Objects</h3>
          </div>
        </div>

        {/* Dynamic Data Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <History size={16} /> History
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'users' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Users size={16} /> Directory
              </button>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">Live Persistence On</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'orders' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="px-8 py-4">Transaction ID</th>
                    <th className="px-8 py-4">User Details</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">No real-time transactions detected.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-slate-900">{order.id}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-semibold">{order.userName}</p>
                          <p className="text-[10px] text-slate-400">{order.userEmail}</p>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-900">{order.total}Rs</td>
                        <td className="px-8 py-6 text-xs text-slate-500">{order.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="px-8 py-4">Identity</th>
                    <th className="px-8 py-4">Email Address</th>
                    <th className="px-8 py-4">Security Credentials</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">No students registered in database.</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-600">{user.email}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit">
                            <Lock size={12} className="text-slate-400" />
                            <span className="text-xs font-mono font-bold text-slate-600">{user.password || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[10px] font-black uppercase text-green-500 tracking-widest">Active Member</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
