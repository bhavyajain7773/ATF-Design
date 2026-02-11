
import React from 'react';
import { BentoGrid, BentoCard } from '../components/BentoGrid';
import { COURSES, APPLY_URL } from '../constants';
import { ArrowRight, Globe, ShieldCheck, Zap } from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 mb-32">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold tracking-widest text-slate-600 uppercase mb-8">
            Global Trade Education
          </span>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] text-black mb-8">
            Master the Global <br /> Flow of Capital.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Professional trade finance and international banking expertise, tailored for the modern institutional landscape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={APPLY_URL}
              className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Start Application <ArrowRight size={20} />
            </a>
            <button 
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Learn Philosophy
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section (Top Funnel) */}
      <section className="px-6 mb-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Bridging Heritage with Global Excellence.</h2>
            <p className="text-slate-500 text-lg">We bring world-class banking standards to the heart of Rajasthan, training the next generation of financial architects.</p>
          </div>
          <div className="hidden md:block">
            <div className="h-0.5 w-32 bg-slate-100"></div>
          </div>
        </div>

        <BentoGrid>
          <BentoCard className="md:col-span-1 min-h-[300px] flex flex-col justify-between">
            <div className="p-4 bg-slate-50 rounded-2xl w-fit">
              <Globe className="text-black" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Global Standards</h3>
              <p className="text-slate-500 leading-relaxed">Direct alignment with ICC, UCP 600, and SWIFT international protocols used by major tier-1 banks.</p>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-1 min-h-[300px] flex flex-col justify-between">
            <div className="p-4 bg-slate-50 rounded-2xl w-fit">
              <ShieldCheck className="text-black" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">SEBI Preparedness</h3>
              <p className="text-slate-500 leading-relaxed">Our curriculum is built for absolute compliance and readiness for professional certifications.</p>
            </div>
          </BentoCard>

          <BentoCard className="md:col-span-1 min-h-[300px] flex flex-col justify-between">
            <div className="p-4 bg-slate-50 rounded-2xl w-fit">
              <Zap className="text-black" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Local Heart</h3>
              <p className="text-slate-500 leading-relaxed">Operating from Jodhpur, Rajasthan, providing high-touch mentorship without the corporate barriers.</p>
            </div>
          </BentoCard>
        </BentoGrid>
      </section>

      {/* Course Preview */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight mb-4">Core Ecosystem</h2>
          <p className="text-slate-500">Select your path. From entry-level mastery to institutional leadership.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <BentoCard 
              key={course.id}
              onClick={() => onNavigate(`course-${course.id}`)}
              className="flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-12">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  course.level === 'Top' ? 'bg-black text-white border-black' :
                  course.level === 'Middle' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                  'bg-white text-slate-400 border-slate-100'
                }`}>
                  {course.level} Tier
                </span>
                <ArrowRight size={20} className="text-slate-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl font-bold mb-4 leading-tight">{course.title}</h3>
                <p className="text-slate-500 mb-0 group-hover:text-slate-800 transition-colors">{course.shortDescription}</p>
              </div>
            </BentoCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
