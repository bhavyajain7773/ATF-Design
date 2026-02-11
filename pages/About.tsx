
import React from 'react';
import { Clock, MapPin, UserCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-24">
          <h1 className="text-6xl font-extrabold tracking-tighter mb-8">Less Corporate. <br />More Expert.</h1>
          <p className="text-2xl text-slate-500 font-medium leading-relaxed">
            Academy of Trade Finance (ATF) isn't just an institution; it's a mentorship bridge. 
            Located in the cultural hub of Jodhpur, we serve as the middle tier between academic theory and high-stakes banking reality.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-slate-400" size={24} /> The Jodhpur Base
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Based at 18, Shastri Circle, Jodhpur, ATF was founded to democratize world-class trade finance knowledge. We believe the distance from global financial centers like London or Mumbai shouldn't dictate the quality of your banking education.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <UserCheck className="text-slate-400" size={24} /> Mentorship First
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              We've discarded the "factory style" learning. Every student receives a 1-on-1 focus that prioritizes operational mastery over memorization. You learn the mechanics of how capital actually moves across borders.
            </p>
          </div>
        </section>

        <section className="mb-32">
          <h2 className="text-4xl font-bold tracking-tight mb-12">The Journey</h2>
          <div className="relative border-l-2 border-slate-100 pl-8 ml-4 flex flex-col gap-16">
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-4 h-4 bg-black rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-bold">Banking Genesis</h3>
              <p className="text-slate-500 mt-2">The founder begins a deep-immersion career in global trade operations within India's top institutional banks.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-4 h-4 bg-black rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-bold">Bridging the Gap</h3>
              <p className="text-slate-500 mt-2">Recognizing a massive talent shortage in specialized areas like UCP 600 compliance and FOREX risk management.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-4 h-4 bg-black rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-bold">ATF Establishment</h3>
              <p className="text-slate-500 mt-2">Opening the doors at Shastri Circle to provide localized, high-tier financial training with a global outlook.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 italic">"Banking isn't about numbers; it's about the rules that govern those numbers."</h2>
          <p className="text-slate-500 font-medium">— Academy Leadership</p>
        </section>
      </div>
    </div>
  );
};

export default About;
