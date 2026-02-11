
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry. Our team will reach out shortly.');
  };

  return (
    <div className="pt-24 min-h-screen flex flex-col md:flex-row">
      {/* Left: Form */}
      <section className="flex-1 px-8 md:px-24 py-20 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto md:mx-0">
          <header className="mb-12">
            <h1 className="text-5xl font-extrabold tracking-tighter mb-4">Get in Touch.</h1>
            <p className="text-slate-500 font-medium">Ready to start your path from the bottom to the top? Drop us a line.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Professional Email</label>
              <input 
                type="email" 
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Inquiry</label>
              <textarea 
                rows={4}
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium resize-none"
                placeholder="How can we help your career path?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all transform active:scale-95"
            >
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Right: Info + Map Placeholder */}
      <section className="flex-1 bg-slate-900 text-white p-8 md:p-24 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto md:mx-0 space-y-16">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Direct Access</h2>
            
            <div className="flex items-start gap-6">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xl">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Location</p>
                <p className="text-xl font-medium">18, Shastri Circle, Jodhpur, Rajasthan</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xl">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Call</p>
                <p className="text-xl font-medium">082098 50312</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xl">
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Email</p>
                <p className="text-xl font-medium">contact@atf.edu.in</p>
              </div>
            </div>
          </div>

          <div className="aspect-video w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold uppercase tracking-tighter text-4xl opacity-20">
               Map Integration
             </div>
             {/* Simple UI representation of a map */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-white rounded-full animate-ping absolute"></div>
                <div className="w-4 h-4 bg-white rounded-full relative shadow-2xl"></div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
