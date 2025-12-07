
import React from 'react';
import { BrainCircuit, Layers, BookOpen, ArrowRight } from 'lucide-react';
import { Button, Card } from './ui/Components';
import { KeyConcept, TimelineEvent, GlossaryTerm } from '../types';

interface StudyGuideProps {
  concepts: KeyConcept[];
  timeline: TimelineEvent[];
  glossary: GlossaryTerm[];
  onStartQuiz: () => void;
  onOpenFlashcards: () => void;
  onCitationClick: (text: string) => void;
}

const StudyGuide: React.FC<StudyGuideProps> = ({ 
  concepts, 
  timeline, 
  glossary,
  onStartQuiz,
  onOpenFlashcards,
  onCitationClick
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8 pb-32 space-y-10">
      
      {/* Section 1: Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit className="w-32 h-32 text-green-500" />
           </div>
           <div className="relative z-10">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Kiểm tra kiến thức</h3>
              <p className="text-slate-500 text-sm mb-6 mt-1">Ôn tập lại các khái niệm chính với 10 câu hỏi trắc nghiệm được tạo tự động.</p>
              <Button onClick={onStartQuiz} className="bg-green-600 hover:bg-green-700 text-white">
                Bắt đầu ngay
              </Button>
           </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers className="w-32 h-32 text-yellow-500" />
           </div>
           <div className="relative z-10">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 text-yellow-600">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Ghi nhớ thuật ngữ</h3>
              <p className="text-slate-500 text-sm mb-6 mt-1">Học nhanh qua 15 thẻ ghi nhớ (Flashcards) về các định nghĩa quan trọng.</p>
              <Button onClick={onOpenFlashcards} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Mở thẻ ghi nhớ
              </Button>
           </div>
        </div>
      </section>

      {/* Section 2: Key Concepts */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Các khái niệm cốt lõi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map((concept) => (
            <Card key={concept.id} className="p-5 hover:border-indigo-200 transition-colors">
              <h4 className="font-bold text-slate-900 mb-3 text-lg">{concept.title}</h4>
              <ul className="space-y-2 mb-4">
                {concept.points.map((point, idx) => (
                  <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onCitationClick(concept.citation)}
                className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
              >
                {concept.citation}
              </button>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 3: Timeline */}
        <section className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-6">Quy trình & Dòng thời gian</h2>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 py-2">
            {timeline.map((event) => (
              <div key={event.id} className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full" />
                <h4 className="font-bold text-slate-900 text-base">{event.step}</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Glossary */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-6">Từ điển thuật ngữ</h2>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
            {glossary.map((item) => (
              <div key={item.id} className="p-4">
                <span className="block font-bold text-indigo-700 text-sm mb-1">{item.term}</span>
                <span className="text-slate-600 text-sm leading-snug">{item.definition}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
};

export default StudyGuide;
