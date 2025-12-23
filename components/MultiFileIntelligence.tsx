import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Bot, Send, Loader2, Layers, Eye, X } from 'lucide-react';
import { extractTextFromFile } from '../services/fileService';
import { GeminiService } from '../services/geminiService';
import { AnalysisConfig, ArtistStyle, ChatMessage, SUPPORTED_MODELS } from '../types';

interface Props {
  apiKey: string;
  config: AnalysisConfig;
  style: ArtistStyle;
  setConfig: (c: AnalysisConfig) => void;
}

interface ProcessedFile {
    id: string;
    file: File;
    text: string;
}

export const MultiFileIntelligence: React.FC<Props> = ({ apiKey, config, style, setConfig }) => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [combinedSummary, setCombinedSummary] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<ProcessedFile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsProcessing(true);
      const newFiles: ProcessedFile[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        try {
            const text = await extractTextFromFile(file);
            newFiles.push({
                id: Math.random().toString(36).substr(2, 9),
                file,
                text
            });
        } catch (err) {
            console.error(`Error reading ${file.name}`, err);
        }
      }
      setFiles(prev => [...prev, ...newFiles]);
      setIsProcessing(false);
    }
  };

  const removeFile = (id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
  };

  const generateCombinedReport = async () => {
    if (!apiKey) {
        alert("Please provide an API Key.");
        return;
    }
    if (files.length === 0) return;

    setIsProcessing(true);
    // Combine text from all files
    const combinedContext = files.map(f => `--- START FILE: ${f.file.name} ---\n${f.text}\n--- END FILE ---\n`).join('\n');
    
    const service = new GeminiService(apiKey);
    const result = await service.generateDeepSummary(combinedContext, config);
    setCombinedSummary(result);
    setIsProcessing(false);
  };

  const handleChat = async () => {
    if (!query.trim() || !apiKey) return;
    const userMsg = { role: 'user', content: query, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg as ChatMessage]);
    setQuery('');
    setChatLoading(true);

    const combinedContext = files.map(f => `--- FILE: ${f.file.name} ---\n${f.text}`).join('\n');
    const service = new GeminiService(apiKey);
    const response = await service.chatWithContext(query, combinedContext, chatHistory, config);
    
    setChatHistory(prev => [...prev, { role: 'model', content: response, timestamp: Date.now() } as ChatMessage]);
    setChatLoading(false);
  };

    useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* LEFT: File Manager (3 cols) */}
      <div className={`lg:col-span-3 p-4 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20 flex flex-col gap-4`}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold opacity-80">Docs Stack</h2>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{files.length} files</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {files.map(f => (
                  <div key={f.id} className="p-3 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-colors group relative">
                      <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 opacity-70" />
                          <p className="text-xs font-bold truncate w-24">{f.file.name}</p>
                      </div>
                      <div className="flex justify-between mt-2">
                          <button onClick={() => setPreviewFile(f)} className="text-[10px] uppercase tracking-wide opacity-60 hover:opacity-100 hover:text-blue-300 flex items-center gap-1">
                              <Eye className="w-3 h-3"/> Preview
                          </button>
                          <button onClick={() => removeFile(f.id)} className="text-[10px] uppercase tracking-wide opacity-60 hover:opacity-100 hover:text-red-300 flex items-center gap-1">
                              <X className="w-3 h-3"/> Remove
                          </button>
                      </div>
                  </div>
              ))}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <Upload className="w-6 h-6 mb-2 opacity-50" />
                  <span className="text-xs opacity-70">Add PDF/DOCX</span>
                  <input type="file" multiple onChange={handleFilesUpload} className="hidden" accept=".pdf,.docx,.txt" />
              </label>
          </div>
      </div>

      {/* CENTER: Output/Chat (6 cols) */}
      <div className={`lg:col-span-6 p-6 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20 flex flex-col relative`}>
        {/* Model Selector */}
        <div className="absolute top-4 right-4 z-10">
             <select 
                value={config.model}
                onChange={(e) => setConfig({...config, model: e.target.value})}
                className="bg-black/20 border border-white/30 rounded px-2 py-1 text-xs backdrop-blur text-white"
            >
                {SUPPORTED_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
        </div>

        {combinedSummary ? (
            <>
                 <div className="flex-1 overflow-y-auto mb-4 pr-2">
                    <h1 className={`text-2xl font-bold mb-6 ${style.accentColor} border-b border-white/20 pb-4`}>Unified Intelligence Report</h1>
                    <div className="prose prose-sm prose-invert max-w-none">
                         {combinedSummary.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h2>;
                            if (line.startsWith('## ')) return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.replace('## ', '')}</h3>;
                            if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc opacity-80">{line.replace('* ', '')}</li>;
                            return <p key={i} className="mb-2 text-sm opacity-90">{line}</p>;
                        })}
                    </div>
                 </div>

                 {/* Chat Area */}
                 <div className="h-64 border-t border-white/20 pt-4 flex flex-col">
                     <div className="flex-1 overflow-y-auto space-y-3 mb-2" ref={scrollRef}>
                        {chatHistory.map((msg, i) => (
                             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[90%] p-2 rounded text-xs ${msg.role === 'user' ? 'bg-white/20' : 'bg-black/30'}`}>
                                     {msg.content}
                                 </div>
                             </div>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                            placeholder="Interrogate the combined documents..."
                            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none"
                        />
                        <button onClick={handleChat} disabled={chatLoading} className="p-2 bg-white/10 rounded hover:bg-white/20">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                 </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-60">
                 <Layers className="w-16 h-16 mb-4" />
                 <h3 className="text-xl font-bold">Multi-Document Synthesis</h3>
                 <p className="text-sm text-center max-w-md mt-2">Upload multiple files to create a unified 3000-word master report and interrogate them as a single knowledge base.</p>
                 
                 <button 
                    onClick={generateCombinedReport}
                    disabled={files.length === 0 || isProcessing}
                    className={`mt-8 px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 ${style.bgGradient} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                 >
                     {isProcessing ? <span className="flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Synthesizing...</span> : 'Combine & Analyze'}
                 </button>
            </div>
        )}
      </div>

      {/* RIGHT: Preview Pane (3 cols) */}
      <div className={`lg:col-span-3 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 hidden lg:flex flex-col`}>
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Document Viewer</h3>
          {previewFile ? (
              <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="mb-2 pb-2 border-b border-white/10">
                      <p className="font-bold truncate text-sm">{previewFile.file.name}</p>
                      <p className="text-[10px] opacity-50">{previewFile.file.type}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto bg-white/5 p-2 rounded text-[10px] font-mono leading-relaxed whitespace-pre-wrap">
                      {previewFile.text.substring(0, 5000)}
                      {previewFile.text.length > 5000 && <span className="text-yellow-500 block mt-2">[Preview Truncated]</span>}
                  </div>
              </div>
          ) : (
              <div className="flex-1 flex items-center justify-center opacity-30 text-xs text-center">
                  Select a file from the stack to preview its extracted content.
              </div>
          )}
      </div>
    </div>
  );
};