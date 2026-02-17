
import React, { useState, useEffect } from 'react';
import { APPLY_URL } from '../constants';
import { Course } from '../types';
import { ChevronDown, Menu, X, ShoppingCart, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
  cartCount: number;
  courses: Course[];
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPath, cartCount, courses }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
    isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'
  }`;

  const linkClasses = (path: string) => `
    px-4 py-2 text-sm font-medium transition-colors hover:text-black
    ${currentPath === path ? 'text-black font-bold' : 'text-slate-500'}
  `;

  return (
    <nav className={navClasses}>
      <div className="flex items-center gap-12">
        <button 
          onClick={() => onNavigate('home')} 
          className="text-2xl font-extrabold tracking-tighter text-black"
        >
          ATF.
        </button>

        <div className="hidden md:flex items-center">
          <button onClick={() => onNavigate('home')} className={linkClasses('home')}>Home</button>
          <button onClick={() => onNavigate('about')} className={linkClasses('about')}>About</button>
          
          <div 
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className={`${linkClasses('courses')} flex items-center gap-1`}>
              Courses <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-80 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 overflow-hidden">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => {
                        onNavigate(`course-${course.id}`);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors group/item"
                    >
                      <p className="text-sm font-semibold text-slate-900 group-hover/item:text-black">{course.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{course.shortDescription}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button onClick={() => onNavigate('contact')} className={linkClasses('contact')}>Contact</button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => onNavigate('cart')}
          className="relative p-2 text-slate-500 hover:text-black transition-colors"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
              {cartCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => onNavigate('account')}
          className="p-2 text-slate-500 hover:text-black transition-colors"
        >
          <User size={20} />
        </button>

        <a 
          href={APPLY_URL}
          className="hidden md:block bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all transform active:scale-95 ml-2"
        >
          Apply Now
        </a>
        
        <button 
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 md:hidden flex flex-col gap-4 shadow-xl">
          <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Home</button>
          <button onClick={() => { onNavigate('about'); setIsMenuOpen(false); }} className="text-left text-lg font-medium">About</button>
          <button onClick={() => { onNavigate('cart'); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Cart ({cartCount})</button>
          <button onClick={() => { onNavigate('account'); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Account</button>
          <div className="py-2 border-y border-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Our Programs</p>
            <div className="grid gap-4">
              {courses.map(course => (
                <button 
                  key={course.id}
                  onClick={() => { onNavigate(`course-${course.id}`); setIsMenuOpen(false); }}
                  className="text-left text-sm font-semibold text-slate-700"
                >
                  {course.title}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }} className="text-left text-lg font-medium">Contact</button>
          <a 
            href={APPLY_URL}
            className="w-full bg-black text-white py-4 rounded-2xl text-center font-bold"
          >
            Apply Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
