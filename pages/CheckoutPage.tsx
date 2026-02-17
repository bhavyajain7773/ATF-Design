
import React, { useState } from 'react';
import { Course, Order, User } from '../types';
import { ShieldCheck, CreditCard, Wallet, Smartphone, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';

interface CheckoutPageProps {
  cart: Course[];
  user: User | null;
  discount: number;
  onCompleteOrder: (order: Order) => void;
  onNavigate: (path: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, user, discount, onCompleteOrder, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastPurchasedCourseId, setLastPurchasedCourseId] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const total = Math.max(0, subtotal - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Store the ID before the cart is cleared in the parent component
    if (cart.length > 0) {
      setLastPurchasedCourseId(cart[0].id);
    }
    
    // Simulate secure gateway delay
    setTimeout(() => {
      const newOrder: Order = {
        id: `ATF-${Math.floor(Math.random() * 1000000)}`,
        userId: user?.id || 'guest',
        items: [...cart],
        total: total,
        discount: discount,
        date: new Date().toLocaleDateString(),
        status: 'Enrolled',
        paymentMethod,
        trackingNumber: `TXN-${Math.floor(Math.random() * 9000000) + 1000000}`
      };
      
      onCompleteOrder(newOrder);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-20 px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="max-w-xl mx-auto">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4">Enrollment Success!</h1>
          <p className="text-xl text-slate-500 mb-12">Your payment has been processed securely. Welcome to the Academy of Trade Finance.</p>
          
          <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-12 border border-slate-100 text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Learning Dashboard</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">Your professional modules are now active. You can start your journey into institutional finance immediately.</p>
            <button 
              onClick={() => {
                if (lastPurchasedCourseId) {
                  onNavigate(`material-${lastPurchasedCourseId}`);
                } else {
                  onNavigate('account');
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all mb-4 shadow-lg shadow-slate-200"
            >
              Access Learning Portal <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('account')}
              className="block w-full text-center py-4 text-slate-400 hover:text-black font-bold text-xs uppercase tracking-widest transition-all"
            >
              View Profile & History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-50/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-2">Finalize Enrollment.</h1>
          <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck size={14} /> 256-bit Secure Encryption
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 space-y-12">
            {/* Step 1: Identity */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                Billing Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-black/5" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-black/5"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-black/5"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Payment */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'Credit Card', icon: <CreditCard size={20} /> },
                  { id: 'UPI', icon: <Smartphone size={20} /> },
                  { id: 'Crypto', icon: <Wallet size={20} /> },
                  { id: 'Net Banking', icon: <Landmark size={20} /> }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 ${
                      paymentMethod === method.id 
                        ? 'bg-black text-white border-black shadow-xl shadow-slate-200' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {method.icon}
                    <span className="text-xs font-bold uppercase tracking-widest">{method.id}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-32 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Summary</h3>
              <div className="space-y-4 mb-10">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium truncate pr-4">{item.title}</span>
                    <span className="font-bold shrink-0">{item.price}Rs</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm text-green-600 font-bold">
                    <span>Discount</span>
                    <span>-{discount}Rs</span>
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-slate-100 mb-10 flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Amount</span>
                <span className="text-4xl font-black">{total}Rs</span>
              </div>
              
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-6 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Gateway...</span>
                  </div>
                ) : (
                  <>Complete Enrollment <ShieldCheck size={20} /></>
                )}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-3 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                <ShieldCheck size={12} /> SSL Secure Checkout
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
