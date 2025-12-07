
import React, { useState } from 'react';
import { Share, Headphones, MoreVertical, ArrowLeft, MessageSquare, BookOpen } from 'lucide-react';
import { Button, Tabs, TabsTrigger } from './ui/Components';
import SourceSidebar from './SourceSidebar';
import ChatInterface from './ChatInterface';
import DocumentViewer from './DocumentViewer';
import AddSourceModal, { ImportedFile } from './AddSourceModal';
import AudioPlayer from './AudioPlayer';
import StudyGuide from './StudyGuide';
import ImmersiveModal from './ImmersiveModal';
import { Project, Source, Message, Citation, WorkspaceTab, KeyConcept, TimelineEvent, GlossaryTerm, Flashcard, QuizQuestion } from '../types';

interface WorkspaceProps {
  project: Project;
  onBack: () => void;
}

// Mock Data
const MOCK_SOURCES: Source[] = [
  { id: 's1', name: 'Tai_lieu_nghien_cuu_v1.pdf', type: 'pdf', status: 'ready', isSelected: true, tokensUsed: 1500, totalTokens: 0 },
  { id: 's2', name: 'Wiki_Kien_truc_RAG.html', type: 'web', status: 'ready', isSelected: true, tokensUsed: 500, totalTokens: 0 },
  { id: 's3', name: 'Meeting_Notes_2024.docx', type: 'doc', status: 'processing', isSelected: false, tokensUsed: 0, totalTokens: 0 },
  { id: 's4', name: 'Lecture_01_Intro.mp4', type: 'youtube', status: 'error', isSelected: false, tokensUsed: 0, totalTokens: 0 },
];

const MOCK_MESSAGES: Message[] = [
  { 
    id: 'm1', 
    role: 'user', 
    content: 'RAG hoạt động như thế nào?', 
    timestamp: 1 
  },
  { 
    id: 'm2', 
    role: 'ai', 
    content: 'RAG (Retrieval-Augmented Generation) hoạt động theo quy trình 3 bước sau:\n\n1. **Retrieval (Truy xuất):** Hệ thống tìm kiếm các đoạn thông tin liên quan từ cơ sở dữ liệu vector dựa trên câu hỏi của người dùng.\n2. **Augmentation (Tăng cường):** Các thông tin tìm được sẽ được ghép vào prompt ngữ cảnh gửi cho mô hình ngôn ngữ (LLM).\n3. **Generation (Sinh):** LLM sẽ tổng hợp thông tin và sinh ra câu trả lời chính xác, có dẫn chứng cụ thể.',
    citations: [
      { id: 'c1', sourceId: 's1', page: 1, text: 'Cơ chế hoạt động của RAG bao gồm 3 bước chính', snippet: 'Trích từ Tai_lieu_nghien_cuu_v1.pdf (Trang 1)' }
    ],
    timestamp: 2 
  }
];

// Mock Study Data
const MOCK_CONCEPTS: KeyConcept[] = [
  { id: 'k1', title: 'Retrieval (Truy xuất)', points: ['Tìm kiếm vector tương đồng', 'Sử dụng Dense Passage Retrieval'], citation: '[Trang 2]' },
  { id: 'k2', title: 'Augmentation (Tăng cường)', points: ['Chèn context vào prompt', 'Giới hạn độ dài token'], citation: '[Trang 4]' },
  { id: 'k3', title: 'Generation (Sinh)', points: ['Sử dụng LLM (Gemini, GPT)', 'Hallucination control'], citation: '[Trang 5]' }
];

const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 't1', step: 'Bước 1: Ingestion', description: 'Thu thập dữ liệu từ nhiều nguồn (PDF, Web, Audio), làm sạch và chia nhỏ (chunking).' },
  { id: 't2', step: 'Bước 2: Embedding', description: 'Chuyển đổi văn bản thành vector số học và lưu trữ vào Vector Database (Pinecone, Milvus).' },
  { id: 't3', step: 'Bước 3: Inference', description: 'Khi người dùng hỏi, hệ thống tìm vector gần nhất và gửi kèm câu hỏi cho AI.' }
];

const MOCK_GLOSSARY: GlossaryTerm[] = [
  { id: 'g1', term: 'Hallucination', definition: 'Hiện tượng mô hình ngôn ngữ tự bịa ra thông tin sai lệch nhưng diễn đạt rất tự tin.' },
  { id: 'g2', term: 'Vector Database', definition: 'Cơ sở dữ liệu chuyên dụng để lưu trữ và truy vấn các vector embeddings nhiều chiều.' },
  { id: 'g3', term: 'Chunking', definition: 'Kỹ thuật chia nhỏ văn bản dài thành các đoạn ngắn hơn để tối ưu hóa việc tìm kiếm và giới hạn token.' }
];

const MOCK_FLASHCARDS: Flashcard[] = [
  { id: 'f1', front: 'RAG là viết tắt của gì?', back: 'Retrieval-Augmented Generation' },
  { id: 'f2', front: 'Vector Embedding là gì?', back: 'Biểu diễn dữ liệu (văn bản, ảnh) dưới dạng danh sách các số thực để máy tính hiểu được ngữ nghĩa.' },
  { id: 'f3', front: 'Zero-shot prompting', back: 'Kỹ thuật đặt câu hỏi cho mô hình mà không cung cấp bất kỳ ví dụ mẫu nào.' }
];

const MOCK_QUIZ: QuizQuestion[] = [
  { 
    id: 'q1', 
    question: 'Thành phần nào KHÔNG thuộc kiến trúc RAG?', 
    options: ['Retrieval System', 'Vector Database', 'Image Diffusion Model', 'LLM Generator'], 
    correctAnswerIndex: 2, 
    explanation: 'Image Diffusion Model (như Stable Diffusion) dùng để sinh ảnh, không phải là thành phần cốt lõi của quy trình RAG xử lý văn bản.' 
  },
  { 
    id: 'q2', 
    question: 'Mục đích chính của bước Retrieval là gì?', 
    options: ['Tạo ra câu trả lời cuối cùng', 'Tìm kiếm thông tin liên quan từ cơ sở tri thức', 'Lưu trữ lịch sử chat', 'Dịch ngôn ngữ'], 
    correctAnswerIndex: 1, 
    explanation: 'Retrieval (Truy xuất) có nhiệm vụ quét cơ sở dữ liệu để tìm các đoạn văn bản khớp với ngữ cảnh câu hỏi nhất.' 
  }
];

const Workspace: React.FC<WorkspaceProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('chat');
  const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  
  // Immersive Modal State
  const [immersiveModal, setImmersiveModal] = useState<{ isOpen: boolean, mode: 'quiz' | 'flashcard' }>({ isOpen: false, mode: 'quiz' });
  
  // Document Viewer State
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);

  // Handlers
  const handleToggleSource = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, isSelected: !s.isSelected } : s));
  };

  const handleSendMessage = (text: string) => {
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newUserMsg]);

    // Simulate AI Response
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Đây là câu trả lời mô phỏng. Trong phiên bản thực tế, phần này sẽ được kết nối với Gemini API để xử lý văn bản từ các nguồn tài liệu của bạn.',
        timestamp: Date.now(),
        citations: []
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 1500);
  };

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation);
    setIsDocViewerOpen(true);
  };

  const handleAddSource = (files: ImportedFile[]) => {
    const newSources: Source[] = files.map((f, idx) => ({
      id: `new_${Date.now()}_${idx}`,
      name: f.name,
      type: f.type,
      status: 'processing', // Start as processing
      isSelected: true,
      tokensUsed: 0,
      totalTokens: 0
    }));

    setSources(prev => [...prev, ...newSources]);

    // Simulate processing completion after 3 seconds
    setTimeout(() => {
      setSources(prev => prev.map(s => {
        if (newSources.find(ns => ns.id === s.id)) {
          return { ...s, status: 'ready', tokensUsed: Math.floor(Math.random() * 5000) + 500 };
        }
        return s;
      }));
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* 2.1 Left Sidebar */}
      <SourceSidebar 
        sources={sources}
        onToggleSource={handleToggleSource}
        onDeleteSource={(id) => setSources(sources.filter(s => s.id !== id))}
        onAddSource={() => setIsAddSourceModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Center & Right Area Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 relative">
        
        {/* GLOBAL HEADER */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white flex-shrink-0 z-10">
          <div className="flex items-center gap-3 w-1/3">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:text-slate-900 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <h2 className="font-heading font-semibold text-slate-800 text-lg truncate" title={project.title}>
              {project.title}
            </h2>
          </div>

          <div className="flex-1 flex justify-center">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as WorkspaceTab)}>
              <TabsTrigger value="chat">
                 <MessageSquare className="w-4 h-4" />
                 Chat & Hỏi
              </TabsTrigger>
              <TabsTrigger value="study">
                 <BookOpen className="w-4 h-4" />
                 Góc học tập
              </TabsTrigger>
            </Tabs>
          </div>
          
          <div className="flex items-center justify-end gap-2 w-1/3">
            <Button variant="ghost" size="icon" className="text-slate-500">
               <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500">
               <Headphones className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500">
               <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main Tab Content */}
          <div className="flex-1 flex flex-col min-w-0 transition-all">
             {activeTab === 'chat' ? (
                <ChatInterface 
                  project={project}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onCitationClick={handleCitationClick}
                />
             ) : (
                <StudyGuide 
                  concepts={MOCK_CONCEPTS}
                  timeline={MOCK_TIMELINE}
                  glossary={MOCK_GLOSSARY}
                  onStartQuiz={() => setImmersiveModal({ isOpen: true, mode: 'quiz' })}
                  onOpenFlashcards={() => setImmersiveModal({ isOpen: true, mode: 'flashcard' })}
                  onCitationClick={(ref) => alert(`Navigating to ${ref}`)}
                />
             )}
          </div>

          {/* 2.3 Right Document Viewer (Slides over or squeezes content) */}
          <DocumentViewer 
            activeCitation={activeCitation}
            isOpen={isDocViewerOpen}
            onClose={() => setIsDocViewerOpen(false)}
          />

        </div>

        {/* 4.1 Audio Player (Sticky Footer) */}
        <AudioPlayer projectTitle={project.title} />
      </div>

      {/* 3.1 Add Source Modal */}
      <AddSourceModal 
        isOpen={isAddSourceModalOpen}
        onClose={() => setIsAddSourceModalOpen(false)}
        onImport={handleAddSource}
      />

      {/* 5.2 Immersive Modal */}
      <ImmersiveModal 
        isOpen={immersiveModal.isOpen}
        onClose={() => setImmersiveModal({ ...immersiveModal, isOpen: false })}
        mode={immersiveModal.mode}
        flashcards={MOCK_FLASHCARDS}
        quizQuestions={MOCK_QUIZ}
      />
    </div>
  );
};

export default Workspace;
