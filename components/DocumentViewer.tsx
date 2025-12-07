import React, { useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Citation } from '../types';
import { Button } from './ui/Components';

interface DocumentViewerProps {
  activeCitation: Citation | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ activeCitation, isOpen, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to highlight when citation changes
  useEffect(() => {
    if (isOpen && activeCitation && contentRef.current) {
      // Find the highlighted element (simulated id matching logic)
      const element = document.getElementById(`highlight-${activeCitation.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isOpen, activeCitation]);

  return (
    <div 
      className={`
        border-l border-slate-200 bg-white shadow-xl z-20 transition-all duration-300 flex flex-col
        ${isOpen ? 'w-[40%] min-w-[400px]' : 'w-0 overflow-hidden opacity-0'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800 truncate max-w-[200px]">
            Tai_lieu_nghien_cuu_v1.pdf
          </span>
          <span className="text-xs text-slate-500">
             Trang {activeCitation?.page || 1} / 25
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
            <RotateCw className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 mx-2" />
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-slate-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* PDF Canvas (Simulated) */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto p-8 bg-slate-100/50"
      >
        <div className="bg-white shadow-sm p-8 min-h-[800px] max-w-2xl mx-auto rounded-sm space-y-4 text-justify font-serif text-slate-800 leading-7">
          <h1 className="text-2xl font-bold mb-6 font-sans">Tổng quan về Mô hình Ngôn ngữ Lớn và RAG</h1>
          <p>
            Mô hình ngôn ngữ lớn (LLM) đã tạo ra một cuộc cách mạng trong lĩnh vực trí tuệ nhân tạo.
            Tuy nhiên, chúng vẫn gặp phải các vấn đề về ảo giác (hallucination) và thiếu cập nhật kiến thức.
          </p>
          <p>
            Để giải quyết vấn đề này, kiến trúc 
            <span className="font-bold"> Retrieval-Augmented Generation (RAG) </span>
            đã ra đời. RAG cho phép mô hình truy xuất thông tin từ một cơ sở tri thức bên ngoài trước khi sinh câu trả lời.
          </p>
          
          {/* Simulated Highlighted Paragraph */}
          <div className="relative p-2 my-4 border-l-4 border-indigo-200 bg-indigo-50/30">
            <p>
              Cơ chế hoạt động của RAG bao gồm 3 bước chính: 
              1) <span className="italic">Retrieval</span> (Truy xuất): Tìm kiếm các đoạn văn bản liên quan từ vector database. 
              2) <span className="italic">Augmentation</span> (Tăng cường): Đưa thông tin tìm được vào prompt context. 
              3) <span className="italic">Generation</span> (Sinh): LLM tạo ra câu trả lời dựa trên context đã được làm giàu.
            </p>
             {/* Dynamic Highlight Layer based on ID */}
             {activeCitation && activeCitation.page === 1 && (
               <div 
                 id={`highlight-${activeCitation.id}`}
                 className="absolute inset-0 bg-yellow-300/30 mix-blend-multiply rounded pointer-events-none animate-pulse"
               />
             )}
          </div>

          <p>
            Trong ứng dụng thực tế, RAG giúp xây dựng các hệ thống "Second Brain" cho cá nhân, 
            cho phép người dùng tương tác với kho tài liệu riêng của họ mà không cần phải retrain mô hình.
          </p>
          <p>
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
           <p>
             Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
             Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
