
import React, { useState } from 'react';
import { BentoGrid, BentoCard } from '../components/BentoGrid';
import { COURSES, APPLY_URL } from '../constants';
import { ArrowRight, Globe, ShieldCheck, Zap, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface HomeProps {
  onNavigate: (path: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [userContext, setUserContext] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState<{courseId: string, reasoning: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAiConsult = async () => {
    if (!userContext.trim()) return;
    setIsLoading(true);
    try {
      // Initialize GoogleGenAI with the API key from environment variables
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are a senior banking career consultant for the Academy of Trade Finance.
        Based on the user's background: "${userContext}", recommend the best course from the following list:
        ${COURSES.map(c => `- ${c.title} (ID: ${c.id}): ${c.shortDescription}`).join('\n')}
        
        Return the response in JSON format.
      `;

      // Use generateContent with responseSchema as recommended for JSON responses
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              courseId: {
                type: Type.STRING,
                description: 'The ID of the recommended course matching one of the provided IDs',
              },
              reasoning: {
                type: Type.STRING,
                description: 'A concise, professional 2-sentence explanation of why this fits their career trajectory.',
              }
            },
            required: ["courseId", "reasoning"],
          }
        }
      });

      // Directly access .text property from GenerateContentResponse
      const text = response.text?.trim();
      if (text) {
        const result = JSON.parse(text);
        setAiRecommendation(result);
      }
    } catch (error) {
      console.error("AI Consultation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* AI Path Advisor Section */}
      <section className="px-6 mb-32 max-w-7xl mx-auto">
        <div className="bg-black rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Sparkles className="text-blue-400" size={20} />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase opacity-60">AI Path Advisor</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Unsure of your next move?</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Our intelligent consultant analyzes your professional background to suggest the most impactful tier for your career trajectory.
              </p>
              
              <div className="relative group">
                <textarea 
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="e.g. I am a fresh graduate interested in cross-border payments..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none h-32"
                />
                <button 
                  onClick={handleAiConsult}
                  disabled={isLoading}
                  className="absolute bottom-4 right-4 bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Consult AI"}
                </button>
              </div>
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
              {aiRecommendation ? (
                <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2 block">Recommendation</span>
                    <h3 className="text-2xl font-bold mb-4">{COURSES.find(c => c.id === aiRecommendation.courseId)?.title}</h3>
                    <p className="text-slate-300 leading-relaxed mb-6">{aiRecommendation.reasoning}</p>
                    <button 
                      onClick={() => onNavigate(`course-${aiRecommendation.courseId}`)}
                      className="text-sm font-bold flex items-center gap-2 hover:text-blue-400 transition-colors"
                    >
                      View Curriculum <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 border-2 border-dashed border-white/5 rounded-3xl p-12 w-full">
                  <p className="italic">Analysis will appear here...</p>
                </div>
              )}
            </div>
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
