
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CoursePage from './pages/CoursePage';
import { COURSES } from './constants';

const App: React.FC = () => {
  // Simple state-based routing for a single-page feel without path manipulation
  const [currentPath, setCurrentPath] = useState('home');

  useEffect(() => {
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  const renderPage = () => {
    if (currentPath === 'home') return <Home onNavigate={setCurrentPath} />;
    if (currentPath === 'about') return <About />;
    if (currentPath === 'contact') return <Contact />;
    
    if (currentPath.startsWith('course-')) {
      const courseId = currentPath.replace('course-', '');
      const course = COURSES.find(c => c.id === courseId);
      if (course) return <CoursePage course={course} />;
    }

    return <Home onNavigate={setCurrentPath} />;
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-black selection:text-white">
      <Navbar currentPath={currentPath} onNavigate={setCurrentPath} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      <footer className="bg-white border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tighter mb-4">ATF.</h2>
            <p className="text-slate-400 font-medium max-w-xs">
              Academy of Trade Finance. Bridging global financial standards with localized mentorship excellence.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm font-semibold text-slate-600">
                <li><button onClick={() => setCurrentPath('home')} className="hover:text-black">Home</button></li>
                <li><button onClick={() => setCurrentPath('about')} className="hover:text-black">About</button></li>
                <li><button onClick={() => setCurrentPath('contact')} className="hover:text-black">Contact</button></li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Course Levels</h4>
              <ul className="space-y-2 text-sm font-semibold text-slate-600">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-black"></div> Top Level</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Middle Level</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div> Bottom Level</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm font-semibold text-slate-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest flex flex-col sm:flex-row justify-between gap-4">
          <p>© {new Date().getFullYear()} Academy of Trade Finance. Built for the modern banker.</p>
          <p>18, Shastri Circle, Jodhpur, RJ - 342001</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
