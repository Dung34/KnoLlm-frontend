
import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, RefreshCw, Rotate3D } from 'lucide-react';
import { Button, ProgressBar, cn } from './ui/Components';
import { Flashcard, QuizQuestion } from '../types';

interface ImmersiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'quiz' | 'flashcard';
  flashcards?: Flashcard[];
  quizQuestions?: QuizQuestion[];
}

const ImmersiveModal: React.FC<ImmersiveModalProps> = ({ 
  isOpen, 
  onClose, 
  mode,
  flashcards = [],
  quizQuestions = []
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Flashcard State
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleNext = () => {
    if (mode === 'flashcard') {
      if (currentIndex < flashcards.length - 1) {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
      }
    } else {
      // Quiz Next
      if (currentIndex < quizQuestions.length - 1) {
        setSelectedOption(null);
        setIsAnswered(false);
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (mode === 'flashcard' && currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === quizQuestions[currentIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  // --- Renderers ---

  const renderFlashcard = () => {
    const card = flashcards[currentIndex];
    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-4">
        <div 
          className="relative w-[600px] h-[400px] cursor-pointer group perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={cn(
            "w-full h-full transition-all duration-500 preserve-3d relative shadow-2xl rounded-2xl",
            isFlipped ? "rotate-y-180" : ""
          )}>
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-2xl flex flex-col items-center justify-center p-12 text-center border-b-4 border-slate-200">
              <span className="text-xs font-semibold text-slate-400 uppercase mb-4 tracking-widest">Thuật ngữ</span>
              <h3 className="text-4xl font-bold text-slate-900 leading-tight">{card.front}</h3>
              <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <Rotate3D className="w-4 h-4" /> Bấm để lật
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-indigo-50 rounded-2xl flex flex-col items-center justify-center p-12 text-center rotate-y-180 border-b-4 border-indigo-200">
              <span className="text-xs font-semibold text-indigo-400 uppercase mb-4 tracking-widest">Định nghĩa</span>
              <p className="text-xl font-medium text-slate-800 leading-relaxed">{card.back}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-6">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800" onClick={handlePrev} disabled={currentIndex === 0}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Trước
          </Button>
          
          <div className="flex gap-3">
             <Button variant="danger" className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50">Quên</Button>
             <Button className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white border border-yellow-500/50">Nhớ mang máng</Button>
             <Button className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/50">Thuộc lòng</Button>
          </div>

          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
            Sau <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const question = quizQuestions[currentIndex];
    const isCorrect = selectedOption === question.correctAnswerIndex;

    return (
      <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 pt-10 pb-20">
        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center items-center text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono mb-6 border border-slate-700">
            Question {currentIndex + 1} of {quizQuestions.length}
          </span>
          <h3 className="text-3xl font-bold text-white leading-snug">{question.question}</h3>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, idx) => {
            let stateStyle = "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700";
            if (isAnswered) {
              if (idx === question.correctAnswerIndex) {
                stateStyle = "bg-green-500/20 border-green-500 text-green-400";
              } else if (idx === selectedOption) {
                stateStyle = "bg-red-500/20 border-red-500 text-red-400";
              } else {
                stateStyle = "bg-slate-900 border-slate-800 text-slate-600 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(idx)}
                disabled={isAnswered}
                className={cn(
                  "p-6 rounded-xl border-2 text-left transition-all duration-200 flex items-start justify-between group",
                  stateStyle
                )}
              >
                <span className="font-medium text-lg">{opt}</span>
                {isAnswered && idx === question.correctAnswerIndex && <Check className="w-5 h-5 text-green-500" />}
                {isAnswered && idx === selectedOption && idx !== question.correctAnswerIndex && <X className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {/* Explanation / Next */}
        {isAnswered && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
             <div className={cn(
               "p-4 rounded-lg border mb-4",
               selectedOption === question.correctAnswerIndex 
                 ? "bg-green-500/10 border-green-500/30" 
                 : "bg-red-500/10 border-red-500/30"
             )}>
               <p className={cn("text-sm font-semibold mb-1", selectedOption === question.correctAnswerIndex ? "text-green-400" : "text-red-400")}>
                 {selectedOption === question.correctAnswerIndex ? "Chính xác!" : "Chưa chính xác"}
               </p>
               <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
             </div>
             
             <div className="flex justify-end">
               <Button onClick={handleNext} className="gap-2" disabled={currentIndex === quizQuestions.length - 1}>
                 Câu tiếp theo <ArrowRight className="w-4 h-4" />
               </Button>
             </div>
          </div>
        )}
      </div>
    );
  };

  const currentTotal = mode === 'flashcard' ? flashcards.length : quizQuestions.length;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950 text-white overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="flex-1 flex justify-center">
           <div className="w-full max-w-md flex flex-col gap-1">
             <div className="flex justify-between text-xs text-slate-400 font-medium">
               <span>{mode === 'quiz' ? 'Kiểm tra kiến thức' : 'Thẻ ghi nhớ'}</span>
               <span>{currentIndex + 1} / {currentTotal}</span>
             </div>
             <ProgressBar value={currentIndex + 1} max={currentTotal} />
           </div>
        </div>
        <button 
          onClick={onClose}
          className="absolute right-6 top-5 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'flashcard' ? renderFlashcard() : renderQuiz()}
      </div>
    </div>
  );
};

export default ImmersiveModal;
