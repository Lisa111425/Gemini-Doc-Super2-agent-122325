import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, ArrowRight, Bot, Download, Loader2, Send, Copy, Check, FileType, Eye, Code } from 'lucide-react';
import { extractTextFromFile, downloadContent } from '../services/fileService';
import { GeminiService } from '../services/geminiService';
import { AnalysisConfig, ArtistStyle, ChatMessage, FileData, SUPPORTED_MODELS } from '../types';

interface Props {
  apiKey: string;
  config: AnalysisConfig;
  style: ArtistStyle;
  setConfig: (c: AnalysisConfig) => void;
}

export const FileIntelligence: React.FC<Props> = ({ apiKey, config, style, setConfig }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'markdown' | 'text'>('markdown');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setIsProcessing(true);
      try {
        const text = await extractTextFromFile(f);
        setFileContent(text);
      } catch (err) {
        alert("Error parsing file");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const generateReport = async () => {
    if (!apiKey) {
        alert("Please provide an API Key first.");
        return;
    }
    setIsProcessing(true);
    const service = new GeminiService(apiKey);
    const result = await service.generateDeepSummary(fileContent, config);
    setSummary(result);
    setIsProcessing(false);
  };

  const handleChat = async () => {
    if (!query.trim() || !apiKey) return;
    const userMsg = { role: 'user', content: query, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg as ChatMessage]);
    setQuery('');
    setChatLoading(true);

    const service = new GeminiService(apiKey);
    const response = await service.chatWithContext(query, fileContent, chatHistory, config);
    
    setChatHistory(prev => [...prev, { role: 'model', content: response, timestamp: Date.now() } as ChatMessage]);
    setChatLoading(false);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className={`text-3xl font-bold mb-4 ${style.accentColor}`}>{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className={`text-2xl font-bold mt-6 mb-3 border-b border-current pb-1`}>{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:opacity-50">{line.replace(/^[*|-]\s/, '')}</li>;
        // Simple bold parser
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <p key={i} className="mb-2 opacity-90 leading-relaxed">
                {parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index} className={style.accentColor}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>
        );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* LEFT: Input & Configuration */}
      <div className={`p-6 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20 flex flex-col gap-6`}>
         <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${style.accentColor}`}>File Intelligence</h2>
            <select 
                value={config.model}
                onChange={(e) => setConfig({...config, model: e.target.value})}
                className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm backdrop-blur"
            >
                {SUPPORTED_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
         </div>

         {!file ? (
             <div className="border-2 border-dashed border-white/40 rounded-xl h-64 flex flex-col items-center justify-center p-8 hover:bg-white/5 transition-colors relative">
                 <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.docx,.txt,.md" />
                 <Upload className={`w-12 h-12 mb-4 ${style.textColor} opacity-50`} />
                 <p className="text-center font-medium opacity-80">Drag & Drop or Click to Upload</p>
                 <p className="text-xs opacity-50 mt-2">Supports PDF, DOCX, TXT</p>
             </div>
         ) : (
             <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20">
                 <FileText className="w-8 h-8 opacity-70" />
                 <div className="flex-1 overflow-hidden">
                     <p className="font-bold truncate">{file.name}</p>
                     <p className="text-xs opacity-60">{(file.size / 1024).toFixed(2)} KB</p>
                 </div>
                 <button onClick={() => setFile(null)} className="text-xs underline opacity-50 hover:opacity-100">Remove</button>
             </div>
         )}

         {file && fileContent && !summary && (
             <button 
                onClick={generateReport}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform ${style.bgGradient} text-white`}
             >
                 {isProcessing ? <Loader2 className="animate-spin" /> : <Bot />}
                 Generate Masterpiece Report
             </button>
         )}

         {summary && (
             <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                 <h3 className="font-bold opacity-80 flex items-center gap-2">
                    <Bot className="w-4 h-4"/> AI Interrogator (RAG)
                 </h3>
                 <div className="flex-1 overflow-y-auto bg-black/10 rounded-lg p-4 space-y-4" ref={scrollRef}>
                     {chatHistory.map((msg, i) => (
                         <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-white/20 ml-4' : 'bg-black/20 mr-4'}`}>
                                 {/* Render chat message with basic markdown support */}
                                 {msg.role === 'model' ? (
                                     <div className="prose prose-invert prose-sm leading-relaxed">
                                        {msg.content.split('\n').map((l, j) => <p key={j} className="mb-1">{l}</p>)}
                                     </div>
                                 ) : msg.content}
                             </div>
                         </div>
                     ))}
                     {chatLoading && <div className="text-xs opacity-50 animate-pulse">Thinking...</div>}
                 </div>
                 <div className="flex gap-2">
                     <input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                        placeholder="Ask about the file..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-white/50"
                     />
                     <button onClick={handleChat} disabled={chatLoading} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                         <Send className="w-5 h-5" />
                     </button>
                 </div>
             </div>
         )}
      </div>

      {/* RIGHT: Output */}
      <div className={`p-8 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20 overflow-y-auto relative h-[80vh]`}>
          {!summary ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <FileText className="w-24 h-24 mb-4" />
                  <p className="text-xl font-serif italic">"Art is not what you see, but what you make others see."</p>
                  <p className="mt-2 text-sm">- Edgar Degas</p>
              </div>
          ) : (
              <>
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button 
                        onClick={() => setViewMode(prev => prev === 'markdown' ? 'text' : 'markdown')} 
                        className="p-2 bg-black/20 hover:bg-black/40 rounded text-white transition-colors"
                        title={viewMode === 'markdown' ? "View Raw Text" : "View Markdown"}
                      >
                          {viewMode === 'markdown' ? <Code className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                      <button 
                        onClick={copyToClipboard} 
                        className="p-2 bg-black/20 hover:bg-black/40 rounded text-white transition-colors"
                        title="Copy to Clipboard"
                      >
                          {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                      </button>
                      <button 
                        onClick={() => downloadContent(summary, `Report-${file?.name}`, 'md')} 
                        className="p-2 bg-black/20 hover:bg-black/40 rounded text-white transition-colors flex items-center gap-1 text-xs"
                        title="Download Markdown"
                      >
                          <Download className="w-4 h-4"/> MD
                      </button>
                      <button 
                        onClick={() => downloadContent(summary, `Report-${file?.name}`, 'txt')} 
                        className="p-2 bg-black/20 hover:bg-black/40 rounded text-white transition-colors flex items-center gap-1 text-xs"
                        title="Download Text"
                      >
                          <FileText className="w-4 h-4"/> TXT
                      </button>
                  </div>
                  <div className="pt-8">
                      {viewMode === 'markdown' ? (
                          <div className="prose prose-sm lg:prose-base max-w-none">
                              {renderMarkdown(summary)}
                          </div>
                      ) : (
                          <textarea 
                            readOnly 
                            value={summary} 
                            className="w-full h-full min-h-[60vh] bg-black/10 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none text-opacity-80 leading-relaxed"
                          />
                      )}
                  </div>
              </>
          )}
      </div>
    </div>
  );
};