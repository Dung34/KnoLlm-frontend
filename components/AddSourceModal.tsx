import React, { useState, useCallback } from 'react';
import { Dialog, Button, Input, Textarea } from './ui/Components';
import { CloudUpload, Globe, Youtube, FileText, Trash2, File, Play } from 'lucide-react';
import { SourceType } from '../types';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (files: ImportedFile[]) => void;
}

export interface ImportedFile {
  type: SourceType;
  name: string;
  content?: string; // For text/url
  file?: File; // For raw files
}

type TabType = 'file' | 'web' | 'youtube' | 'text';

const AddSourceModal: React.FC<AddSourceModalProps> = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState<TabType>('file');
  const [isLoading, setIsLoading] = useState(false);

  // Tab 1: Files State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Tab 2: Web State
  const [webUrl, setWebUrl] = useState('');

  // Tab 3: Youtube State
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Tab 4: Text State
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  // Reset when closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedFiles([]);
        setWebUrl('');
        setYoutubeUrl('');
        setTextTitle('');
        setTextContent('');
        setActiveTab('file');
      }, 300);
    }
  }, [isOpen]);

  // --- Handlers ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const importedData: ImportedFile[] = [];

    if (activeTab === 'file') {
      selectedFiles.forEach(f => {
        let type: SourceType = 'doc';
        if (f.type.includes('pdf')) type = 'pdf';
        importedData.push({ type, name: f.name, file: f });
      });
    } else if (activeTab === 'web') {
      if (webUrl) {
         importedData.push({ type: 'web', name: webUrl, content: webUrl });
      }
    } else if (activeTab === 'youtube') {
      if (youtubeUrl) {
        // Extract video ID for mock title if needed
        importedData.push({ type: 'youtube', name: youtubeUrl, content: youtubeUrl });
      }
    } else if (activeTab === 'text') {
      if (textTitle && textContent) {
        importedData.push({ type: 'doc', name: textTitle, content: textContent });
      }
    }

    onImport(importedData);
    setIsLoading(false);
    onClose();
  };

  // Validation for "Import" button
  const isImportDisabled = () => {
    if (activeTab === 'file') return selectedFiles.length === 0;
    if (activeTab === 'web') return !webUrl.trim();
    if (activeTab === 'youtube') return !youtubeUrl.trim();
    if (activeTab === 'text') return !textTitle.trim() || !textContent.trim();
    return true;
  };

  const getImportLabel = () => {
    if (isLoading) return 'Đang tải lên...';
    if (activeTab === 'file' && selectedFiles.length > 0) return `Thêm ${selectedFiles.length} nguồn`;
    return 'Thêm nguồn';
  };

  // --- Render Helpers ---

  const renderTabTrigger = (id: TabType, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all
        ${activeTab === id 
          ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200' 
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Thêm nguồn dữ liệu"
      description="Chọn loại tệp hoặc dán liên kết để bắt đầu phân tích."
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Hủy</Button>
          <Button onClick={handleImport} disabled={isImportDisabled()} isLoading={isLoading}>
            {getImportLabel()}
          </Button>
        </>
      }
    >
      {/* Tabs Navigation */}
      <div className="bg-slate-100/50 p-1 rounded-lg grid grid-cols-4 gap-1 mb-6">
        {renderTabTrigger('file', 'Tập tin', <FileText className="w-4 h-4" />)}
        {renderTabTrigger('web', 'Website', <Globe className="w-4 h-4" />)}
        {renderTabTrigger('youtube', 'Youtube', <Youtube className="w-4 h-4" />)}
        {renderTabTrigger('text', 'Văn bản', <File className="w-4 h-4" />)}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[300px]">
        
        {/* TAB 1: FILES */}
        {activeTab === 'file' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
              className={`
                border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-12 px-4 text-center cursor-pointer transition-colors
                ${isDragging 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <input 
                id="file-upload" 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt"
              />
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <CloudUpload className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Kéo thả tệp vào đây, hoặc click để chọn
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ PDF, DOCX, TXT (Tối đa 10MB/file)
              </p>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đã chọn ({selectedFiles.length})</h4>
                <div className="max-h-[150px] overflow-y-auto space-y-2 pr-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                           <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                           <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WEBSITE */}
        {activeTab === 'web' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="space-y-2">
                <Input 
                  label="Đường dẫn Website"
                  icon={<Globe className="w-4 h-4" />}
                  placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                />
                <p className="text-xs text-slate-500 bg-indigo-50 text-indigo-700 p-3 rounded-md flex gap-2">
                  <span className="font-bold">ℹ️ Info:</span> 
                  KnoLlm sẽ cào toàn bộ văn bản trên trang web này để làm dữ liệu đầu vào.
                </p>
             </div>
          </div>
        )}

        {/* TAB 3: YOUTUBE */}
        {activeTab === 'youtube' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="space-y-4">
                <Input 
                  label="Đường dẫn Video Youtube"
                  icon={<Youtube className="w-4 h-4" />}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                
                {youtubeUrl && (
                  <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center group border border-slate-200">
                     {/* Mock Preview - In real app, extract ID and show thumbnail */}
                     <div className="absolute inset-0 bg-black/40" />
                     <Play className="w-12 h-12 text-white opacity-80 z-10" />
                     <span className="absolute bottom-2 left-2 text-white text-xs font-medium z-10">Preview Video</span>
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  * Chỉ hỗ trợ video có phụ đề (Caption/Transcript).
                </p>
             </div>
          </div>
        )}

        {/* TAB 4: TEXT */}
        {activeTab === 'text' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <Input 
                label="Tiêu đề nguồn"
                placeholder="Ví dụ: Ghi chú cuộc họp ngày 10/10"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
             />
             <Textarea 
                label="Nội dung"
                className="min-h-[200px] font-mono text-sm"
                placeholder="Dán nội dung văn bản vào đây..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
             />
          </div>
        )}

      </div>
    </Dialog>
  );
};

export default AddSourceModal;