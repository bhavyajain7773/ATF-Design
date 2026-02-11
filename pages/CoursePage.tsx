
import React from 'react';
import { Course } from '../types';
import { APPLY_URL } from '../constants';
import { CheckCircle2, ListChecks, CreditCard } from 'lucide-react';

interface CoursePageProps {
  course: Course;
}

const CoursePage: React.FC<CoursePageProps> = ({ course }) => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">
            {course.level} Tier Program
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
            {course.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            {course.shortDescription}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-20">
            {/* Key Outcomes */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-black" /> Key Outcomes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {course.outcomes.map((outcome, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-semibold text-slate-800">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum Breakdown */}
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <ListChecks size={24} className="text-black" /> Curriculum Breakdown
              </h2>
              <div className="space-y-6">
                {course.curriculum.map((item, i) => (
                  <div key={i} className="border border-slate-100 rounded-3xl overflow-hidden">
                    <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100">
                      <h3 className="font-bold text-lg">{item.section}</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {item.topics.map((topic, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          <span className="text-slate-600 font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100/50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Program Enrollment</h3>
              <div className="mb-8">
                <p className="text-slate-500 text-sm mb-1 font-medium">Pricing</p>
                <p className="text-3xl font-bold text-black">{course.price}</p>
              </div>
              <div className="space-y-4">
                <a 
                  href={APPLY_URL}
                  className="block w-full text-center bg-black text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all transform active:scale-[0.98]"
                >
                  Apply Now
                </a>
                <p className="text-[10px] text-center text-slate-400 px-4">
                  Upon clicking, you'll be redirected to our secure application portal. All data is processed via encrypted standards.
                </p>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <CreditCard size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">1-on-1 Mentorship</h4>
                    <p className="text-xs text-slate-500">Direct access to industry veterans.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <ListChecks size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Certification Ready</h4>
                    <p className="text-xs text-slate-500">Built for institutional standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
