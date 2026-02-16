
import React from 'react';
import { Course } from '../types';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface CartPageProps {
  cart: Course[];
  onRemove: (id: string) => void;
  onNavigate: (path: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, onRemove, onNavigate }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter mb-2">Shopping Cart.</h1>
            <p className="text-slate-500 font-medium">Review your program selections before enrollment.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <ShoppingBag size={14} /> {cart.length} items
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-slate-50 rounded-[2.5rem] p-20 text-center border border-slate-100">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag size={32} className="text-slate-200" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
            <p className="text-slate-500 mb-8">It seems you haven't added any professional programs yet.</p>
            <button 
              onClick={() => onNavigate('home')}
              className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="group p-6 bg-white border border-slate-100 rounded-3xl flex items-center gap-6 transition-all hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-xl font-black">
                    {item.level.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                      {item.level} Tier • {item.price}Rs
                    </p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">Subtotal</span>
                    <span>{subtotal}Rs</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">Service Fee</span>
                    <span>0Rs</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-black">{subtotal}Rs</span>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('checkout')}
                  className="w-full bg-black text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all transform active:scale-[0.98]"
                >
                  Checkout <ArrowRight size={20} />
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-6 uppercase font-bold tracking-widest">
                  Secure checkout powered by ATF
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
