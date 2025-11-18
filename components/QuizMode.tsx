
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { learningData } from '../data/learningData';
import { ChevronLeft, ChevronRight, Lightbulb, Code2, GraduationCap, RotateCcw, CheckCircle2, LayoutList, ArrowLeft, ArrowRight } from 'lucide-react';

const QuizMode: React.FC = () => {
  // Extract unique chapters
  const chapters = useMemo(() => [...new Set(learningData.map(d => d.chapter))], []);
  
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
  const [chapterIndex, setChapterIndex] = useState(0); // Index within the specific chapter
  const [isFlipped, setIsFlipped] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter cards for current chapter
  const chapterCards = useMemo(() => 
    learningData.filter(d => d.chapter === selectedChapter), 
  [selectedChapter]);

  const currentCard = chapterCards[chapterIndex];

  // Reset index when chapter changes
  useEffect(() => {
    setChapterIndex(0);
    setIsFlipped(false);
  }, [selectedChapter]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (chapterIndex < chapterCards.length - 1) {
        setIsFlipped(false);
        setTimeout(() => setChapterIndex(prev => prev + 1), 200);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (chapterIndex > 0) {
        setIsFlipped(false);
        setTimeout(() => setChapterIndex(prev => prev - 1), 200);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFlipped(false);
      setTimeout(() => setChapterIndex(0), 200);
  };

  const scrollChapters = (direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
          const scrollAmount = 200;
          scrollContainerRef.current.scrollBy({
              left: direction === 'left' ? -scrollAmount : scrollAmount,
              behavior: 'smooth'
          });
      }
  };

  const progressPercentage = ((chapterIndex + 1) / chapterCards.length) * 100;
  const totalProgress = Math.round(((learningData.findIndex(d => d.id === currentCard.id) + 1) / learningData.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mb-4 shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Interactive Code Course</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
            Master the architecture and codebase from scratch. 
            We start from empty HTML and end with AI Engineering.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
             <span>Course Progress: {totalProgress}% Complete</span>
        </div>
      </div>

      {/* Chapter Selection - Scrollable Container */}
      <div className="mb-8 relative group">
          
          {/* Left Scroll Button */}
          <button 
            onClick={() => scrollChapters('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white shadow-md rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all md:flex hidden"
            aria-label="Scroll Left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Right Scroll Button */}
           <button 
            onClick={() => scrollChapters('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white shadow-md rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all md:flex hidden"
            aria-label="Scroll Right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 px-8 no-scrollbar scroll-smooth"
          >
            <div className="flex gap-3 min-w-max px-1">
                {chapters.map((chap, idx) => (
                    <button
                        key={chap}
                        onClick={() => setSelectedChapter(chap)}
                        className={`flex flex-col items-start p-3 pr-6 rounded-xl transition-all border min-w-[180px] ${
                            selectedChapter === chap 
                            ? 'bg-blue-600 text-white shadow-md scale-[1.02] border-blue-500 ring-2 ring-blue-200' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80 mb-1 font-bold">
                           <LayoutList className="w-3 h-3" />
                           <span>Chapter {idx + 1}</span>
                        </div>
                        <div className="font-bold text-sm leading-tight text-left">
                             {chap.split(': ')[1]}
                        </div>
                    </button>
                ))}
            </div>
          </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8 relative overflow-hidden">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Flashcard Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Desktop Sidebar (Progress List) */}
        <div className="hidden lg:block w-80 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <div className="flex items-center justify-between mb-4 px-2 border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {selectedChapter}
                </h3>
                <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {chapterCards.length} Items
                </span>
            </div>
            <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
                {chapterCards.map((card, idx) => (
                    <button
                        key={card.id}
                        onClick={() => { setIsFlipped(false); setTimeout(() => setChapterIndex(idx), 200); }}
                        className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                            idx === chapterIndex 
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' 
                            : 'text-gray-600 hover:bg-gray-50 font-medium border border-transparent'
                        }`}
                    >
                        <span className="truncate pr-2">{idx + 1}. {card.category}</span>
                        {idx < chapterIndex && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Card Area */}
        <div className="flex-1 w-full">
            <div 
                className="relative h-[550px] w-full perspective-1000 cursor-pointer group select-none"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* FRONT OF CARD */}
                <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-12 flex flex-col items-center justify-center text-center hover:shadow-2xl transition-shadow">
                    <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                        <span className="text-sm font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                            Lesson {chapterIndex + 1} of {chapterCards.length}
                        </span>
                        <div className="text-xs font-bold tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase border border-blue-100">
                            {currentCard.category}
                        </div>
                    </div>
                    
                    <div className="mb-8 p-5 bg-blue-50 rounded-full text-blue-500 ring-8 ring-blue-50/50 shadow-inner">
                        <Lightbulb className="w-12 h-12" />
                    </div>
                    
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight max-w-2xl">
                        {currentCard.question}
                    </h3>
                    
                    <div className="absolute bottom-10 flex flex-col items-center gap-3 animate-pulse">
                        <span className="text-sm text-gray-400 font-semibold tracking-wide uppercase">Tap to reveal</span>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-blue-300 rounded-full" />
                            <div className="w-2 h-2 bg-blue-300 rounded-full" />
                            <div className="w-2 h-2 bg-blue-300 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* BACK OF CARD */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-3xl shadow-xl p-6 md:p-10 flex flex-col text-left overflow-hidden border border-slate-800">
                    
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex items-center gap-2 mb-6 text-blue-400 sticky top-0 bg-slate-900 py-2 z-10 border-b border-slate-800/50">
                            <Code2 className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">{currentCard.category}</span>
                        </div>
                        
                        <p className="text-slate-200 text-lg leading-relaxed mb-8 font-light">
                            {currentCard.answer}
                        </p>

                        {currentCard.codeSnippet && (
                        <div className="bg-black rounded-xl p-5 border border-slate-800 font-mono text-sm text-emerald-400 overflow-x-auto shadow-inner relative group/code">
                            <div className="absolute top-2 right-3 opacity-50 text-[10px] uppercase tracking-widest text-slate-500">Code Example</div>
                            <pre className="whitespace-pre-wrap break-words leading-relaxed">{currentCard.codeSnippet}</pre>
                        </div>
                        )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-center">
                        <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold hover:text-slate-400 transition-colors">Tap card to flip back</span>
                    </div>
                </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8">
                <button 
                    onClick={handlePrev}
                    disabled={chapterIndex === 0}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-colors ${
                        chapterIndex === 0 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Previous</span>
                </button>
                
                <button 
                    onClick={handleReset}
                    className="p-3.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                    title="Restart Chapter"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button 
                    onClick={handleNext}
                    disabled={chapterIndex === chapterCards.length - 1}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg active:scale-95 w-40 justify-center ${
                         chapterIndex === chapterCards.length - 1
                         ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                         : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                    }`}
                >
                    <span className="hidden md:inline">Next Lesson</span>
                    <span className="md:hidden">Next</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMode;
