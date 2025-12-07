import React, { useState, useEffect } from 'react';
import { Dialog, Input, Button } from './ui/Components';
import { CreateProjectFormData } from '../types';

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectFormData) => void;
}

const EMOJI_OPTIONS = ["📚", "🚀", "💡", "🧬", "🎨", "💻", "🌍", "📈"];

const CreateNotebookModal: React.FC<CreateNotebookModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSelectedEmoji(EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, emoji: selectedEmoji });
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Tạo notebook mới"
      footer={
        <>
           <Button variant="ghost" onClick={onClose}>Hủy</Button>
           <Button onClick={handleSubmit} disabled={!title.trim()}>Tạo mới</Button>
        </>
      }
    >
      <form id="create-project-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-4">
          {/* Emoji Selector */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Biểu tượng</label>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center text-2xl bg-slate-100 rounded-lg border border-slate-200">
                {selectedEmoji}
              </div>
              <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`
                      w-10 h-10 flex-shrink-0 flex items-center justify-center text-lg rounded-md transition-all
                      ${selectedEmoji === emoji 
                        ? 'bg-primary-100 border border-primary-200' 
                        : 'hover:bg-slate-100'
                      }
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Input */}
          <Input 
            label="Tên dự án"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Đồ án tốt nghiệp..."
            autoFocus
          />
        </div>
      </form>
    </Dialog>
  );
};

export default CreateNotebookModal;