
import React, { useState, useMemo } from 'react';
import { Course, CourseQuiz, CourseVideo } from '../types';
import { 
  Play, 
  BookOpen, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  MonitorPlay,
  ClipboardCheck,
  Award,
  Info,
  Layers,
  Search
} from 'lucide-react';

interface CourseMaterialPageProps {
  course: Course;
  onNavigate: (path: string) => void;
}

const CourseMaterialPage: React.FC<CourseMaterialPageProps> = ({ course, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'mcq'>('video');
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  
  // Quiz Session State
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState<string | 'all' | null>(null);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Fallback Data
  const videos = course.videos && course.videos.length > 0 ? course.videos : [
    { id: 'default', title: 'Institutional Orientation', description: 'Overview of the trade finance professional landscape.' }
  ];

  const allQuizzes = course.quizzes && course.quizzes.length > 0 ? course.quizzes : [
    {
      id: 'default-q',
      question: `Under UCP 600, what is the maximum number of banking days a bank has to determine if a presentation is complying?`,
      options: ['3 banking days', '5 banking days', '7 banking days', '10 banking days'],
      correct: 1
    }
  ];

  // Filter quizzes based on selected module
  const activeQuizzes = useMemo(() => {
    if (!selectedModuleForQuiz) return [];
    if (selectedModuleForQuiz === 'all') return allQuizzes;
    return allQuizzes.filter(q => q.moduleId === selectedModuleForQuiz);
  }, [selectedModuleForQuiz, allQuizzes]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === activeQuizzes[currentQuizStep].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizStep < activeQuizzes.length - 1) {
      setCurrentQuizStep(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuizSession = () => {
    setSelectedModuleForQuiz(null);
    setCurrentQuizStep(0);
    setQuizScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  const activeVideo = videos[activeVideoIdx];

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Streamlined Header */}
      <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-white z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('account')}
            className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-black"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xs font-black tracking-tighter uppercase text-slate-900 line-clamp-1">{course.title}</h1>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Institutional Mastery Platform</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <MonitorPlay size={12} /> Curriculum
          </button>
          <button 
            onClick={() => { setActiveTab('mcq'); resetQuizSession(); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'mcq' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ClipboardCheck size={12} /> Practice Lab
          </button>
        </div>
      </nav>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
        {activeTab === 'video' ? (
          <>
            <main className="flex-grow bg-[#0A0A0A] relative flex items-center justify-center overflow-hidden">
              {activeVideo.videoUrl ? (
                <div className="w-full h-full animate-in fade-in duration-1000">
                  <video 
                    src={activeVideo.videoUrl} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay
                    poster="/path-to-institutional-poster.jpg"
                  />
                </div>
              ) : (
                <div className="text-center p-12 z-20 animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20">
                    <Play size={38} className="text-white fill-white ml-1" />
                  </div>
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] mb-3">Module {activeVideoIdx + 1}</p>
                  <h2 className="text-white text-2xl font-black tracking-tighter mb-4">{activeVideo.title}</h2>
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                     <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                     <span className="text-[8px] font-black text-white uppercase tracking-widest">No Video Content Attached</span>
                  </div>
                </div>
              )}
            </main>

            <aside className="w-full lg:w-[400px] border-l border-slate-50 overflow-y-auto bg-slate-50/10 shrink-0">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Curriculum List</h3>
                   <span className="text-[9px] font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{videos.length} Modules</span>
                </div>
                <div className="space-y-3">
                  {videos.map((video, idx) => (
                    <button
                      key={video.id}
                      onClick={() => setActiveVideoIdx(idx)}
                      className={`w-full flex items-start gap-4 p-5 rounded-2xl transition-all text-left group ${
                        activeVideoIdx === idx ? 'bg-white shadow-xl shadow-slate-200/50 border border-slate-100' : 'hover:bg-slate-100/50 border border-transparent'
                      }`}
                    >
                      <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                        activeVideoIdx === idx ? 'border-black bg-black text-white' : 'border-slate-100 bg-white text-slate-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-sm font-black leading-tight mb-1 truncate ${activeVideoIdx === idx ? 'text-black' : 'text-slate-600'}`}>{video.title}</p>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight line-clamp-1">{video.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </>
        ) : (
          <div className="flex-grow w-full bg-slate-50/30 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
            {!selectedModuleForQuiz ? (
              /* Module Selection Screen */
              <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <header className="text-center mb-12">
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-2">Practice Selection.</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Choose a knowledge domain to test</p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedModuleForQuiz('all')}
                    className="md:col-span-2 group relative overflow-hidden bg-black p-8 rounded-[2.5rem] text-left transition-all hover:scale-[1.01] shadow-2xl"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white mb-1">Academy Master Test</h3>
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Composite Assessment • {allQuizzes.length} Items</p>
                      </div>
                      <Award size={28} className="text-white/20 group-hover:text-white transition-colors" />
                    </div>
                  </button>

                  {videos.map((video, idx) => {
                    const quizCount = allQuizzes.filter(q => q.moduleId === video.id).length;
                    return (
                      <button
                        key={video.id}
                        disabled={quizCount === 0}
                        onClick={() => setSelectedModuleForQuiz(video.id)}
                        className={`group p-6 bg-white border border-slate-100 rounded-[2rem] text-left transition-all hover:shadow-xl ${quizCount === 0 ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-slate-200'}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Module {idx + 1}</span>
                          <span className="text-[8px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded-full uppercase">
                            {quizCount} Questions
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{video.title}</h3>
                        <div className="flex items-center gap-1 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                          Launch Validation <ChevronRight size={10} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : !showResults ? (
              /* Quiz Session Active - Full Visibility Fix */
              <div className="max-w-xl w-full bg-white border border-slate-100 rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
                <header className="mb-10 flex justify-between items-center">
                  <div>
                    <button onClick={resetQuizSession} className="flex items-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-widest hover:text-black transition-colors mb-2">
                      <ArrowLeft size={10} /> Change Domain
                    </button>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Item {currentQuizStep + 1} of {activeQuizzes.length}</p>
                  </div>
                  <div className="text-[10px] font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-full">
                    {Math.round(((currentQuizStep + 1) / activeQuizzes.length) * 100)}%
                  </div>
                </header>

                <h2 className="text-xl sm:text-2xl font-black leading-tight mb-10 text-slate-900 tracking-tight">
                  {activeQuizzes[currentQuizStep].question}
                </h2>

                <div className="space-y-3 mb-12">
                  {activeQuizzes[currentQuizStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full p-6 rounded-2xl border-2 text-left text-sm font-black transition-all flex items-center justify-between group ${
                        selectedAnswer === idx 
                          ? (isAnswerSubmitted 
                              ? (idx === activeQuizzes[currentQuizStep].correct ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700')
                              : 'bg-black text-white border-black')
                          : (isAnswerSubmitted && idx === activeQuizzes[currentQuizStep].correct ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-slate-100 hover:border-slate-200')
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${
                          selectedAnswer === idx ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                      </span>
                      {isAnswerSubmitted && idx === activeQuizzes[currentQuizStep].correct && <CheckCircle2 size={20} className="text-green-500" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  {!isAnswerSubmitted ? (
                    <button 
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-20 hover:bg-slate-800 transition-all shadow-xl"
                    >
                      Submit Response
                    </button>
                  ) : (
                    <button 
                      onClick={nextQuestion}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                      {currentQuizStep < activeQuizzes.length - 1 ? 'Next Validation Step' : 'View Results'} <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Results Screen */
              <div className="max-w-md w-full bg-white border border-slate-100 rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in duration-700">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Award size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-2 text-slate-900">Validation Complete.</h2>
                <p className="text-slate-400 font-black text-[8px] uppercase tracking-[0.3em] mb-10">Institutional Proficiency Certificate</p>
                
                <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                  <div className="text-6xl font-black mb-1 tracking-tighter text-slate-900">{Math.round((quizScore / activeQuizzes.length) * 100)}%</div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Knowledge Index Score</p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={resetQuizSession}
                    className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg"
                  >
                    Try Different Module
                  </button>
                  <button 
                    onClick={() => { setActiveTab('video'); resetQuizSession(); }}
                    className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-all"
                  >
                    Return to Video Hub
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMaterialPage;
