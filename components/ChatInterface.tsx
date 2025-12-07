
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Send, Brain, ThumbsUp, ThumbsDown, Copy, RotateCcw } from 'lucide-react';
import { Message, Citation, Project } from '../types';
import { Button, Tooltip, Card } from './ui/Components';

interface ChatInterfaceProps {
  project: Project;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onCitationClick: (citation: Citation) => void;
}

const SuggestedChip = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-full transition-colors border border-slate-200"
  >
    {label}
  </button>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage,
  onCitationClick
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-0 animate-in fade-in zoom-in-95 duration-500">
            <div className="p-4 bg-indigo-50 rounded-2xl">
              <Brain className="w-12 h-12 text-primary-600" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Sẵn sàng để bắt đầu?</h3>
              <p className="text-slate-500">Hãy đặt câu hỏi dựa trên các nguồn tài liệu của bạn.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              <SuggestedChip label="Tóm tắt 5 ý chính" onClick={() => onSendMessage("Tóm tắt 5 ý chính của tài liệu này")} />
              <SuggestedChip label="Giải thích khái niệm RAG" onClick={() => onSendMessage("Giải thích khái niệm RAG là gì?")} />
              <SuggestedChip label="Tạo bài kiểm tra trắc nghiệm" onClick={() => onSendMessage("Tạo 5 câu hỏi trắc nghiệm từ nội dung")} />
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div 
                  className={`
                    p-4 rounded-2xl text-base leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                    }
                  `}
                >
                  {msg.content}
                  
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100/20">
                      {msg.citations.map((citation, idx) => (
                        <Tooltip key={citation.id} content={citation.snippet}>
                          <button
                            onClick={() => onCitationClick(citation)}
                            className={`
                              text-xs font-medium px-2 py-1 rounded-md transition-colors flex items-center gap-1
                              ${msg.role === 'user' 
                                ? 'bg-primary-700 hover:bg-primary-800 text-indigo-100' 
                                : 'bg-indigo-50 hover:bg-indigo-100 text-primary-700'
                              }
                            `}
                          >
                            <span className="opacity-60 text-[10px]">{idx + 1}</span>
                            {citation.text.substring(0, 15)}...
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Message Actions */}
                {msg.role === 'ai' && (
                  <div className="flex gap-2 mt-2 ml-2">
                    <button className="text-slate-400 hover:text-slate-600"><Copy className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-slate-600"><ThumbsUp className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-slate-600"><ThumbsDown className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-slate-600"><RotateCcw className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Floating) */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 z-10">
        <Card className="flex items-end p-2 shadow-xl border-slate-200 ring-1 ring-slate-200/50 bg-white/95 backdrop-blur-sm">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-600 mb-1">
             <Paperclip className="w-5 h-5" />
          </Button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi bất cứ gì về tài liệu..."
            className="flex-1 max-h-32 min-h-[44px] py-2.5 px-3 bg-transparent border-0 focus:ring-0 resize-none text-slate-800 placeholder:text-slate-400 text-sm"
            rows={1}
            style={{ overflow: 'hidden' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />

          <div className="flex items-center gap-1 mb-1">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-600">
               <Mic className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              className={`rounded-full transition-all ${inputText.trim() ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}
              onClick={handleSend}
              disabled={!inputText.trim()}
            >
               <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
