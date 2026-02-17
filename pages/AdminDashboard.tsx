
import React, { useMemo, useState, useRef } from 'react';
import { Order, User, AdminStats, Course, CourseVideo, CourseQuiz } from '../types';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowLeft, 
  Search,
  Database,
  History,
  AlertTriangle,
  Lock,
  Tag,
  MonitorPlay,
  ClipboardCheck,
  Plus,
  Trash2,
  ChevronRight,
  Edit3,
  X,
  Save,
  RotateCcw,
  Layers,
  CheckCircle2,
  Upload,
  Video
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  users: User[];
  courses: Course[];
  onUpdateCourse: (course: Course) => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onPurge: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, users, courses, onUpdateCourse, onNavigate, onLogout, onPurge }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'content'>('orders');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCourse = useMemo(() => 
    courses.find(c => c.id === selectedCourseId), 
    [courses, selectedCourseId]
  );

  const stats: AdminStats = useMemo(() => {
    const revenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const popularity: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        popularity[item.title] = (popularity[item.title] || 0) + 1;
      });
    });
    return {
      totalRevenue: revenue,
      totalOrders: orders.length,
      totalUsers: users.length,
      coursePopularity: popularity
    };
  }, [orders, users]);

  // --- Video Management State ---
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState({ title: '', description: '', videoUrl: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleStartEditVideo = (video: CourseVideo) => {
    setEditingVideoId(video.id);
    setVideoForm({ title: video.title, description: video.description, videoUrl: video.videoUrl || '' });
  };

  const handleCancelVideoEdit = () => {
    setEditingVideoId(null);
    setVideoForm({ title: '', description: '', videoUrl: '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoForm(prev => ({ ...prev, videoUrl: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveVideo = () => {
    if (!selectedCourse || !videoForm.title) return;
    
    let updatedVideos: CourseVideo[];
    if (editingVideoId) {
      updatedVideos = (selectedCourse.videos || []).map(v => 
        v.id === editingVideoId ? { ...v, ...videoForm } : v
      );
    } else {
      updatedVideos = [...(selectedCourse.videos || []), { 
        id: `vid-${Date.now()}`, 
        ...videoForm 
      }];
    }
    
    onUpdateCourse({ ...selectedCourse, videos: updatedVideos });
    handleCancelVideoEdit();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteVideo = (vidId: string) => {
    if (!selectedCourse) return;
    const updatedVideos = (selectedCourse.videos || []).filter(v => v.id !== vidId);
    onUpdateCourse({ ...selectedCourse, videos: updatedVideos });
    if (editingVideoId === vidId) handleCancelVideoEdit();
  };

  // --- Quiz Management State ---
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState({ 
    question: '', 
    options: ['', '', '', ''], 
    correct: 0,
    moduleId: '' 
  });

  const handleStartEditQuiz = (quiz: CourseQuiz) => {
    setEditingQuizId(quiz.id);
    setQuizForm({ 
      question: quiz.question, 
      options: [...quiz.options], 
      correct: quiz.correct,
      moduleId: quiz.moduleId || ''
    });
  };

  const handleCancelQuizEdit = () => {
    setEditingQuizId(null);
    setQuizForm({ question: '', options: ['', '', '', ''], correct: 0, moduleId: '' });
  };
  
  const handleSaveQuiz = () => {
    if (!selectedCourse || !quizForm.question) return;
    
    let updatedQuizzes: CourseQuiz[];
    if (editingQuizId) {
      updatedQuizzes = (selectedCourse.quizzes || []).map(q => 
        q.id === editingQuizId ? { ...q, ...quizForm } : q
      );
    } else {
      updatedQuizzes = [...(selectedCourse.quizzes || []), {
        id: `q-${Date.now()}`,
        ...quizForm
      }];
    }

    onUpdateCourse({ ...selectedCourse, quizzes: updatedQuizzes });
    handleCancelQuizEdit();
  };

  const handleDeleteQuiz = (qId: string) => {
    if (!selectedCourse) return;
    const updatedQuizzes = (selectedCourse.quizzes || []).filter(q => q.id !== qId);
    onUpdateCourse({ ...selectedCourse, quizzes: updatedQuizzes });
    if (editingQuizId === qId) handleCancelQuizEdit();
  };

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
            <h1 className="text-xl font-black tracking-tighter text-black">ATF Central.</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onPurge}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-700 transition-colors bg-red-50/50 px-5 py-2.5 rounded-full border border-red-100"
            >
              <AlertTriangle size={12} /> Purge Master Database
            </button>
            <button 
              onClick={onLogout}
              className="text-xs font-bold text-slate-900 uppercase tracking-widest hover:bg-slate-100 px-5 py-2.5 rounded-xl transition-all"
            >
              Logout Session
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Revenue</p>
              <h3 className="text-2xl font-black">{stats.totalRevenue}Rs</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><ShoppingBag size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Orders</p>
              <h3 className="text-2xl font-black">{stats.totalOrders}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Users size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Students</p>
              <h3 className="text-2xl font-black">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Database size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Catalog Count</p>
              <h3 className="text-2xl font-black">{courses.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[700px]">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <History size={16} /> Order Logs
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Users size={16} /> Student Database
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MonitorPlay size={16} /> Content Manager
              </button>
            </div>
          </div>

          <div className="p-10">
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    <tr><th className="pb-6 px-4">TX Identifier</th><th className="pb-6 px-4">Student Identity</th><th className="pb-6 px-4 text-right">Revenue</th><th className="pb-6 px-4">Timestamp</th></tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-all group">
                        <td className="py-5 px-4 font-black text-slate-400 group-hover:text-black transition-colors">{order.id}</td>
                        <td className="py-5 px-4 font-bold">{order.userName}</td>
                        <td className="py-5 px-4 font-black text-right">{order.total}Rs</td>
                        <td className="py-5 px-4 text-slate-400 font-medium">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    <tr><th className="pb-6 px-4">Legal Name</th><th className="pb-6 px-4">Credential (Email)</th><th className="pb-6 px-4">Password Hash</th></tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-all group">
                        <td className="py-5 px-4 font-black text-slate-900">{user.name}</td>
                        <td className="py-5 px-4 font-bold text-slate-500">{user.email}</td>
                        <td className="py-5 px-4 font-mono text-xs text-slate-300 group-hover:text-slate-500 transition-colors">{user.password || 'PLAINTEXT_HIDDEN'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-80 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6 px-2">Select Curriculum</p>
                  {courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        handleCancelVideoEdit();
                        handleCancelQuizEdit();
                      }}
                      className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between border ${selectedCourseId === course.id ? 'bg-black text-white border-black shadow-xl shadow-slate-200' : 'hover:bg-slate-50 text-slate-500 border-transparent'}`}
                    >
                      {course.title} <ChevronRight size={14} className={selectedCourseId === course.id ? 'text-white' : 'text-slate-300'} />
                    </button>
                  ))}
                </div>

                <div className="flex-grow">
                  {!selectedCourse ? (
                    <div className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300">
                      <Edit3 size={64} className="mb-6 opacity-10" />
                      <p className="font-bold text-slate-400">Initialize a program to modify curriculum architecture.</p>
                    </div>
                  ) : (
                    <div className="space-y-20 animate-in fade-in slide-in-from-right-8 duration-700">
                      {/* Video Management */}
                      <section>
                        <h3 className="text-2xl font-black tracking-tighter mb-10 flex items-center gap-4">
                          <MonitorPlay size={32} /> Video Masterclasses
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                          {selectedCourse.videos?.map(video => (
                            <div key={video.id} className={`p-6 rounded-3xl border flex items-start justify-between transition-all ${editingVideoId === video.id ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-50' : 'bg-slate-50 border-slate-100'}`}>
                              <div className="flex-grow pr-6">
                                <p className="font-black text-slate-900 mb-1">{video.title}</p>
                                <p className="text-[11px] font-medium text-slate-400 line-clamp-2">{video.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleStartEditVideo(video)} 
                                  className={`p-3 rounded-xl transition-all ${editingVideoId === video.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-black hover:bg-white'}`}
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDeleteVideo(video.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={`bg-white border p-10 rounded-[2.5rem] space-y-6 shadow-sm transition-all ${editingVideoId ? 'border-blue-200 ring-8 ring-blue-50' : 'border-slate-100'}`}>
                          <div className="flex items-center justify-between">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                               {editingVideoId ? 'Operational Mode: Editing Module' : 'Draft New Module'}
                             </p>
                             {editingVideoId && (
                               <button onClick={handleCancelVideoEdit} className="text-slate-400 hover:text-black p-2"><X size={18} /></button>
                             )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Video Title</label>
                              <input 
                                placeholder="e.g. Intro to UCP 600" 
                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all" 
                                value={videoForm.title} 
                                onChange={e => setVideoForm({...videoForm, title: e.target.value})} 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Orientation (Short Description)</label>
                              <input 
                                placeholder="Core fundamentals for beginners" 
                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all" 
                                value={videoForm.description} 
                                onChange={e => setVideoForm({...videoForm, description: e.target.value})} 
                              />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Video Source (File Upload or URL)</label>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                  placeholder="https://youtube.com/..." 
                                  className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all" 
                                  value={videoForm.videoUrl} 
                                  onChange={e => setVideoForm({...videoForm, videoUrl: e.target.value})} 
                                />
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    accept="video/*" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                  />
                                  <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`h-full px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black'}`}
                                    disabled={isUploading}
                                  >
                                    {isUploading ? <><RotateCcw size={16} className="animate-spin" /> Processing...</> : <><Upload size={16} /> Choose File</>}
                                  </button>
                                </div>
                              </div>
                              {videoForm.videoUrl.startsWith('data:') && (
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-1">
                                  <Video size={10} /> Local Video Content Attached
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            {editingVideoId && (
                              <button 
                                onClick={handleCancelVideoEdit} 
                                className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                              >
                                <RotateCcw size={16} /> Discard Changes
                              </button>
                            )}
                            <button 
                              onClick={handleSaveVideo} 
                              disabled={isUploading}
                              className={`flex-[2] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all text-white ${editingVideoId ? 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200' : 'bg-black hover:bg-slate-800 shadow-xl shadow-slate-200'} ${isUploading ? 'opacity-50' : ''}`}
                            >
                              {editingVideoId ? <><Save size={16} /> Sync Module Data</> : <><Plus size={16} /> Commit New Module</>}
                            </button>
                          </div>
                        </div>
                      </section>

                      {/* Quiz Management */}
                      <section className="pt-20 border-t border-slate-100">
                        <h3 className="text-2xl font-black tracking-tighter mb-10 flex items-center gap-4">
                          <ClipboardCheck size={32} /> Practice MCQs
                        </h3>
                        <div className="space-y-6 mb-10">
                          {selectedCourse.quizzes?.map((quiz, qIdx) => (
                            <div key={quiz.id} className={`p-8 rounded-[2rem] border transition-all ${editingQuizId === quiz.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                              <div className="flex justify-between mb-6">
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black text-white bg-slate-900 px-3 py-1.5 rounded-full uppercase tracking-widest">Question {qIdx + 1}</span>
                                  {quiz.moduleId && (
                                    <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      <Layers size={12} /> {selectedCourse.videos?.find(v => v.id === quiz.moduleId)?.title || 'Unlinked'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleStartEditQuiz(quiz)} 
                                    className={`p-3 rounded-xl transition-all ${editingQuizId === quiz.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-black hover:bg-white'}`}
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"><Trash2 size={16} /></button>
                                </div>
                              </div>
                              <p className="font-black text-lg mb-6 leading-tight text-slate-900">{quiz.question}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {quiz.options.map((opt, i) => (
                                  <div key={i} className={`px-5 py-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${i === quiz.correct ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                                    <span className="flex items-center gap-3"><span className="opacity-40">{String.fromCharCode(65+i)}.</span> {opt}</span>
                                    {i === quiz.correct && <CheckCircle2 size={14} />}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={`bg-white border p-12 rounded-[3rem] space-y-8 shadow-sm transition-all ${editingQuizId ? 'border-blue-200 ring-8 ring-blue-50' : 'border-slate-100'}`}>
                          <div className="flex items-center justify-between">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                               {editingQuizId ? 'Operational Mode: Modifying MCQ' : 'Draft Practice Challenge'}
                             </p>
                             {editingQuizId && (
                               <button onClick={handleCancelQuizEdit} className="text-slate-400 hover:text-black p-2"><X size={18} /></button>
                             )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Statement of Inquiry</label>
                            <textarea 
                              placeholder="Enter the critical question statement..." 
                              className="w-full px-8 py-6 bg-slate-50 rounded-3xl text-xs font-bold focus:ring-4 focus:ring-black/5 outline-none transition-all min-h-[120px] resize-none" 
                              value={quizForm.question} 
                              onChange={e => setQuizForm({...quizForm, question: e.target.value})} 
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Link to Video Module (Recommended)</label>
                            <select 
                              className="w-full px-8 py-5 bg-slate-50 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-black/5 outline-none appearance-none"
                              value={quizForm.moduleId}
                              onChange={e => setQuizForm({...quizForm, moduleId: e.target.value})}
                            >
                              <option value="">General Question (Not Linked)</option>
                              {selectedCourse.videos?.map(v => (
                                <option key={v.id} value={v.id}>{v.title}</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {quizForm.options.map((opt, i) => (
                              <div key={i} className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Option {String.fromCharCode(65+i)}</label>
                                <input 
                                  placeholder={`Response ${String.fromCharCode(65+i)}`} 
                                  className={`w-full px-6 py-4 rounded-2xl text-xs font-bold outline-none transition-all ${quizForm.correct === i ? 'bg-green-50 border-2 border-green-200' : 'bg-slate-50 border border-transparent'}`} 
                                  value={opt} 
                                  onChange={e => {
                                    const newOpts = [...quizForm.options];
                                    newOpts[i] = e.target.value;
                                    setQuizForm({...quizForm, options: newOpts});
                                  }} 
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Validated Answer:</span>
                            <div className="flex gap-2">
                              {[0, 1, 2, 3].map(i => (
                                <button key={i} onClick={() => setQuizForm({...quizForm, correct: i})} className={`w-14 h-14 rounded-2xl text-xs font-black border transition-all ${quizForm.correct === i ? 'bg-black text-white border-black shadow-lg' : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200'}`}>{String.fromCharCode(65+i)}</button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-4">
                             {editingQuizId && (
                                <button 
                                  onClick={handleCancelQuizEdit} 
                                  className="flex-1 bg-slate-100 text-slate-500 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                                >
                                  <RotateCcw size={16} /> Discard
                                </button>
                             )}
                            <button 
                              onClick={handleSaveQuiz} 
                              className={`flex-[3] py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all text-white ${editingQuizId ? 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200' : 'bg-black hover:bg-slate-800 shadow-xl shadow-slate-200'}`}
                            >
                              {editingQuizId ? <><Save size={18} /> Sync Challenge Data</> : <><Plus size={18} /> Initialize Challenge</>}
                            </button>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
