
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
  Video,
  AlertCircle
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
  const [uploadError, setUploadError] = useState('');

  const handleStartEditVideo = (video: CourseVideo) => {
    setEditingVideoId(video.id);
    setVideoForm({ title: video.title, description: video.description, videoUrl: video.videoUrl || '' });
    setUploadError('');
  };

  const handleCancelVideoEdit = () => {
    setEditingVideoId(null);
    setVideoForm({ title: '', description: '', videoUrl: '' });
    setUploadError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Browser limit for localStorage strings is usually ~5MB. Base64 adds ~33% overhead.
    // 2MB is a safe limit for mobile/desktop browser persistence.
    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError("Video file is too large (>2.5MB). For larger videos, please use a YouTube/Vimeo URL instead.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadError('');
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoForm(prev => ({ ...prev, videoUrl: reader.result as string }));
      setIsUploading(false);
    };
    reader.onerror = () => {
      setUploadError("File reading failed.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveVideo = () => {
    if (!selectedCourse) return;
    if (!videoForm.title) {
      setUploadError("Module title is required.");
      return;
    }
    
    try {
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
    } catch (err) {
      setUploadError("Failed to update course data. Likely storage limit exceeded.");
    }
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
            <button onClick={() => onNavigate('home')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
            <h1 className="text-xl font-black tracking-tighter text-black">ATF Central.</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onPurge} className="text-[10px] font-black uppercase text-red-500 bg-red-50/50 px-5 py-2.5 rounded-full border border-red-100 flex items-center gap-2"><AlertTriangle size={12} /> Purge Database</button>
            <button onClick={onLogout} className="text-xs font-bold text-slate-900 uppercase tracking-widest hover:bg-slate-100 px-5 py-2.5 rounded-xl transition-all">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Revenue</p>
              <h3 className="text-2xl font-black">{stats.totalRevenue}Rs</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><ShoppingBag size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Orders</p>
              <h3 className="text-2xl font-black">{stats.totalOrders}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Users size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Users</p>
              <h3 className="text-2xl font-black">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Database size={24} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Courses</p>
              <h3 className="text-2xl font-black">{courses.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[700px]">
          <div className="p-10 border-b border-slate-50 flex items-center gap-1 bg-slate-100/30">
            <button onClick={() => setActiveTab('orders')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-md' : 'text-slate-400'}`}>Orders</button>
            <button onClick={() => setActiveTab('users')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-black shadow-md' : 'text-slate-400'}`}>Students</button>
            <button onClick={() => setActiveTab('content')} className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-black shadow-md' : 'text-slate-400'}`}>Curriculum</button>
          </div>

          <div className="p-10">
            {activeTab === 'content' && (
              <div className="flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-80 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6 px-2">Select Program</p>
                  {courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => { setSelectedCourseId(course.id); handleCancelVideoEdit(); handleCancelQuizEdit(); }}
                      className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${selectedCourseId === course.id ? 'bg-black text-white border-black' : 'hover:bg-slate-50 text-slate-500 border-transparent'}`}
                    >
                      {course.title}
                    </button>
                  ))}
                </div>

                <div className="flex-grow">
                  {!selectedCourse ? (
                    <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300">
                      <Edit3 size={64} className="mb-6 opacity-10" />
                      <p className="font-bold text-slate-400">Select a course to modify its contents.</p>
                    </div>
                  ) : (
                    <div className="space-y-16 animate-in fade-in duration-500">
                      <section>
                        <h3 className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-4"><MonitorPlay size={32} /> Video Modules</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                          {selectedCourse.videos?.map(video => (
                            <div key={video.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 flex items-start justify-between">
                              <div className="flex-grow pr-4">
                                <p className="font-black text-slate-900 mb-1">{video.title}</p>
                                <p className="text-[10px] font-medium text-slate-400 line-clamp-1">{video.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleStartEditVideo(video)} className="p-2 text-slate-400 hover:text-black transition-colors"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteVideo(video.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
                          <div className="flex items-center justify-between">
                             <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                               {editingVideoId ? 'Editing Module' : 'Add New Video Module'}
                             </p>
                             {editingVideoId && <button onClick={handleCancelVideoEdit} className="text-slate-300 hover:text-black"><X size={16} /></button>}
                          </div>

                          {uploadError && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold">
                              <AlertCircle size={14} /> {uploadError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Module Title</label>
                              <input 
                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-slate-200" 
                                value={videoForm.title} 
                                onChange={e => setVideoForm({...videoForm, title: e.target.value})} 
                                placeholder="Module Name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Summary</label>
                              <input 
                                className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-slate-200" 
                                value={videoForm.description} 
                                onChange={e => setVideoForm({...videoForm, description: e.target.value})} 
                                placeholder="What is this video about?"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Video Source</label>
                              <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                  className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-slate-200" 
                                  value={videoForm.videoUrl} 
                                  onChange={e => setVideoForm({...videoForm, videoUrl: e.target.value})} 
                                  placeholder="https://..."
                                />
                                <div className="relative">
                                  <input type="file" accept="video/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                  <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black'}`}
                                  >
                                    <Upload size={14} /> {isUploading ? 'Reading...' : 'Local File'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 flex gap-3">
                            <button 
                              onClick={handleSaveVideo} 
                              disabled={isUploading}
                              className="flex-1 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <Save size={16} /> {editingVideoId ? 'Submit Changes' : 'Finalize & Post Module'}
                            </button>
                            {editingVideoId && (
                              <button onClick={handleCancelVideoEdit} className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">Discard</button>
                            )}
                          </div>
                        </div>
                      </section>

                      {/* Quiz Section stays as is but with fixed save handlers */}
                      <section className="pt-16 border-t border-slate-50">
                        <h3 className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-4"><ClipboardCheck size={32} /> MCQs</h3>
                        <div className="space-y-4 mb-8">
                          {selectedCourse.quizzes?.map((quiz, i) => (
                            <div key={quiz.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 flex items-center justify-between">
                              <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Q{i+1}</p>
                                <p className="font-bold text-slate-800">{quiz.question}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleStartEditQuiz(quiz)} className="p-2 text-slate-300 hover:text-black"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manage Practice Question</p>
                          <textarea 
                            className="w-full p-6 bg-slate-50 rounded-2xl text-xs font-bold outline-none resize-none h-24"
                            placeholder="Enter question statement..."
                            value={quizForm.question}
                            onChange={e => setQuizForm({...quizForm, question: e.target.value})}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quizForm.options.map((opt, i) => (
                              <input 
                                key={i} 
                                className={`w-full px-6 py-4 rounded-xl text-xs font-bold outline-none border-2 ${quizForm.correct === i ? 'border-black bg-white' : 'border-transparent bg-slate-50'}`}
                                value={opt}
                                onChange={e => {
                                  const n = [...quizForm.options]; n[i] = e.target.value; setQuizForm({...quizForm, options: n});
                                }}
                                onClick={() => setQuizForm({...quizForm, correct: i})}
                                placeholder={`Option ${String.fromCharCode(65+i)}`}
                              />
                            ))}
                          </div>
                          <button onClick={handleSaveQuiz} className="w-full py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200">
                             {editingQuizId ? 'Update Question' : 'Deploy Question'}
                          </button>
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-50">
                    <tr><th className="pb-6 px-4">Identifier</th><th className="pb-6 px-4">Student</th><th className="pb-6 px-4">Amount</th><th className="pb-6 px-4">Date</th></tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-50">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="py-5 px-4 font-black">{o.id}</td>
                        <td className="py-5 px-4 font-bold">{o.userName}</td>
                        <td className="py-5 px-4 font-black">{o.total}Rs</td>
                        <td className="py-5 px-4 text-slate-400">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border-b border-slate-50">
                    <tr><th className="pb-6 px-4">Name</th><th className="pb-6 px-4">Email</th><th className="pb-6 px-4">Admin Status</th></tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-5 px-4 font-black">{u.name}</td>
                        <td className="py-5 px-4 font-bold text-slate-500">{u.email}</td>
                        <td className="py-5 px-4 font-bold">{u.isAdmin ? 'Full Authority' : 'Student'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
