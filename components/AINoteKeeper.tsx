import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Wand2, CheckSquare, AlignLeft, Send, Type, Edit3, Eye, FileText, Eraser, Copy, Check, Download } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { downloadContent } from '../services/fileService';
import { AnalysisConfig, ArtistStyle, ChatMessage, SUPPORTED_MODELS } from '../types';

interface Props {
  apiKey: string;
  config: AnalysisConfig;
  style: ArtistStyle;
  setConfig: (c: AnalysisConfig) => void;
}

export const AINoteKeeper: React.FC<Props> = ({ apiKey, config, style, setConfig }) => {
  const [rawInput, setRawInput] = useState('');
  const [organizedNote, setOrganizedNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTransform = async () => {
    if (!apiKey) return alert("API Key required");
    if (!rawInput.trim()) return;
    
    setIsProcessing(true);
    const service = new GeminiService(apiKey);
    const result = await service.transformNote(rawInput, config);
    setOrganizedNote(result);
    setViewMode('preview');
    setIsProcessing(false);
  };

  const handleMagic = async (magicType: string) => {
    if (!apiKey) return alert("API Key required");
    if (!organizedNote) return;

    setIsProcessing(true);
    const service = new GeminiService(apiKey);
    const result = await service.runMagic(organizedNote, magicType, config);
    setOrganizedNote(result);
    setIsProcessing(false);
  };

  const handleChat = async () => {
    if (!query.trim() || !apiKey) return;
    
    const userMsg = { role: 'user', content: query, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg as ChatMessage]);
    setQuery('');
    setChatLoading(true);

    const service = new GeminiService(apiKey);
    const context = `CURRENT NOTE CONTENT:\n${organizedNote || rawInput}`;
    const response = await service.chatWithContext(query, context, chatHistory, config);
    
    setChatHistory(prev => [...prev, { role: 'model', content: response, timestamp: Date.now() } as ChatMessage]);
    setChatLoading(false);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(organizedNote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* LEFT: Input & Controls */}
      <div className={`p-6 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20 flex flex-col relative`}>
          <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold ${style.accentColor} flex items-center gap-2`}>
                  <FileText className="w-6 h-6"/> Note Keeper
              </h2>
               <select 
                    value={config.model}
                    onChange={(e) => setConfig({...config, model: e.target.value})}
                    className="bg-white/20 border border-white/30 rounded px-2 py-1 text-xs backdrop-blur"
                >
                    {SUPPORTED_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
          </div>

          {!organizedNote ? (
             <div className="flex-1 flex flex-col gap-4">
                 <textarea 
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Paste your rough notes, brain dump, or chaotic text here..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl p-4 resize-none focus:outline-none focus:border-white/40 font-mono text-sm leading-relaxed"
                 />
                 <button 
                    onClick={handleTransform}
                    disabled={isProcessing || !rawInput}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform ${style.bgGradient} text-white`}
                 >
                     {isProcessing ? <Sparkles className="animate-spin"/> : <Wand2 />}
                     Organize & Beautify
                 </button>
             </div>
          ) : (
             <div className="flex-1 flex flex-col gap-4">
                 <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                    <span className="text-xs font-bold px-2 opacity-70">AI Magics</span>
                    <div className="flex gap-1">
                        <MagicBtn icon={<Type />} label="Format" onClick={() => handleMagic('format')} />
                        <MagicBtn icon={<CheckSquare />} label="Tasks" onClick={() => handleMagic('action')} />
                        <MagicBtn icon={<Edit3 />} label="Fix" onClick={() => handleMagic('grammar')} />
                        <MagicBtn icon={<AlignLeft />} label="Summary" onClick={() => handleMagic('summary')} />
                        <MagicBtn icon={<Wand2 />} label="Expand" onClick={() => handleMagic('expand')} />
                    </div>
                 </div>

                 <div className="flex-1 overflow-hidden flex flex-col relative bg-white/5 rounded-xl border border-white/10">
                     <div className="absolute top-2 right-2 flex gap-1 z-10">
                         <button onClick={copyToClipboard} className="p-1.5 bg-black/40 rounded hover:bg-black/60 text-white" title="Copy">
                             {copied ? <Check className="w-3 h-3 text-green-400"/> : <Copy className="w-3 h-3"/>}
                         </button>
                         <button onClick={() => downloadContent(organizedNote, 'SmartNote', 'md')} className="p-1.5 bg-black/40 rounded hover:bg-black/60 text-white" title="Download MD">
                             <Download className="w-3 h-3"/>
                         </button>
                         <button onClick={() => downloadContent(organizedNote, 'SmartNote', 'txt')} className="p-1.5 bg-black/40 rounded hover:bg-black/60 text-white" title="Download TXT">
                             <FileText className="w-3 h-3"/>
                         </button>
                         <div className="w-px h-4 bg-white/20 mx-1"></div>
                         <button onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')} className="p-1.5 bg-black/40 rounded hover:bg-black/60 text-white" title="Toggle View">
                             {viewMode === 'edit' ? <Eye className="w-3 h-3"/> : <Edit3 className="w-3 h-3"/>}
                         </button>
                         <button onClick={() => {setOrganizedNote(''); setRawInput('');}} className="p-1.5 bg-red-500/40 rounded hover:bg-red-500/60 text-white" title="Clear">
                             <Eraser className="w-3 h-3"/>
                         </button>
                     </div>
                     
                     {viewMode === 'edit' ? (
                         <textarea 
                             value={organizedNote}
                             onChange={(e) => setOrganizedNote(e.target.value)}
                             className="flex-1 w-full h-full bg-transparent p-4 resize-none focus:outline-none font-mono text-sm pt-12"
                         />
                     ) : (
                         <div className="flex-1 w-full h-full overflow-y-auto p-4 pt-12 prose prose-sm prose-invert max-w-none">
                            {organizedNote.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className={`text-2xl font-bold mb-4 mt-2 ${style.accentColor}`}>{line.replace('# ', '')}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className={`text-xl font-bold mt-4 mb-2 border-b border-white/20 pb-1`}>{line.replace('## ', '')}</h2>;
                                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.replace('### ', '')}</h3>;
                                if (line.startsWith('- [ ]')) return <div key={i} className="flex items-center gap-2 my-1"><div className="w-4 h-4 border border-white/50 rounded"/> {line.replace('- [ ]', '')}</div>;
                                if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc opacity-90">{line.replace('- ', '')}</li>;
                                return <p key={i} className="mb-2 opacity-90 leading-relaxed">{line}</p>;
                            })}
                         </div>
                     )}
                 </div>
             </div>
          )}
      </div>

      {/* RIGHT: Chat & Context */}
      <div className={`p-6 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20 flex flex-col h-full`}>
           <h3 className="font-bold opacity-80 flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
               <Bot className="w-5 h-5"/> Note Assistant
           </h3>
           
           <div className="flex-1 overflow-y-auto space-y-4 mb-4" ref={scrollRef}>
               {chatHistory.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                       <Sparkles className="w-12 h-12 mb-2"/>
                       <p className="text-sm">Ask questions about your notes or request specific refinements.</p>
                   </div>
               )}
               {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-white/20 ml-4' : 'bg-black/20 mr-4'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {chatLoading && <div className="text-xs opacity-50 animate-pulse pl-2">Thinking...</div>}
           </div>

           <div className="flex gap-2">
                 <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                    placeholder="E.g. 'What are the deadlines?'"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/50"
                 />
                 <button onClick={handleChat} disabled={chatLoading} className={`p-3 rounded-lg hover:opacity-80 text-white ${style.bgGradient}`}>
                     <Send className="w-5 h-5" />
                 </button>
           </div>
      </div>
    </div>
  );
};

const MagicBtn = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors text-[10px] uppercase font-bold tracking-wider"
    >
        <span className="w-3 h-3">{icon}</span>
        <span className="hidden xl:inline">{label}</span>
    </button>
);