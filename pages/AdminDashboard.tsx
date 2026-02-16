
import React, { useMemo } from 'react';
import { Order, User, AdminStats } from '../types';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowLeft, 
  Search,
  CheckCircle2,
  Clock,
  MoreVertical
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onNavigate, onLogout }) => {
  const stats: AdminStats = useMemo(() => {
    const revenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const popularity: { [key: string]: number } = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        popularity[item.title] = (popularity[item.title] || 0) + 1;
      });
    });

    // Mocking user count for demo
    return {
      totalRevenue: revenue,
      totalOrders: orders.length,
      totalUsers: Math.max(orders.length, 12),
      coursePopularity: popularity
    };
  }, [orders]);

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
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Systems Operational</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-xs font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold text-green-500">+12%</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black">{stats.totalRevenue}Rs</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Enrollments</p>
            <h3 className="text-3xl font-black">{stats.totalOrders}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <Users size={24} />
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Institutional Users</p>
            <h3 className="text-3xl font-black">{stats.totalUsers}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <BarChart3 size={24} />
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Conversion Rate</p>
            <h3 className="text-3xl font-black">4.8%</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Institutional Flows</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter transactions..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="px-8 py-4">Transaction ID</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Method</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">No historical flows detected.</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-slate-900">{order.id}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{order.date}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{order.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-900">{order.total}Rs</td>
                        <td className="px-8 py-6 text-xs text-slate-500 font-bold uppercase">{order.paymentMethod}</td>
                        <td className="px-8 py-6">
                          <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular Courses Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-8">Popular Programs</h2>
              <div className="space-y-6">
                {Object.entries(stats.coursePopularity)
                  .sort(([,a], [,b]) => b - a)
                  .map(([title, count], i) => (
                    <div key={title} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-lg text-xs font-bold">
                          0{i+1}
                        </div>
                        <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{title}</span>
                      </div>
                      <span className="text-xs font-black px-3 py-1 bg-slate-100 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Institutional Health</h3>
                <p className="text-slate-400 text-xs mb-6">Real-time sync with Rajasthan Banking Node</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-xs font-medium">Gateway: Active</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-xs font-medium">Database: Encrypted</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-xs font-medium">Next Backup: 4h 20m</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
