import React, { useState } from 'react';
import { ArrowRight, Bot, RefreshCw, Copy, Check, Download, FileText, Eye, Code } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { downloadContent } from '../services/fileService';
import { AnalysisConfig, ArtistStyle, SUPPORTED_MODELS } from '../types';

interface Props {
  apiKey: string;
  config: AnalysisConfig;
  style: ArtistStyle;
}

export const SmartReplace: React.FC<Props> = ({ apiKey, config, style }) => {
  const [template, setTemplate] = useState('Dear [Client Name],\n\nWe have analyzed your audit for [Fiscal Year] and found [Key Finding].\n\nSincerely,\nAuditFlow Team');
  const [dataSource, setDataSource] = useState('Client: Acme Corp\nYear: 2024\nFinding: 15% discrepancy in logistics overhead.');
  const [instruction, setInstruction] = useState('Replace placeholders. Maintain a professional, formal tone.');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'markdown'>('text');

  const handleProcess = async () => {
    if (!apiKey) return alert("API Key required");
    setLoading(true);
    const service = new GeminiService(apiKey);
    const res = await service.smartReplace(template, dataSource, instruction, config);
    setOutput(res);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h2>;
        if (line.startsWith('## ')) return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.replace('## ', '')}</h3>;
        if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className="ml-4 list-disc opacity-80">{line.replace(/^[*|-]\s/, '')}</li>;
         const parts = line.split(/(\*\*.*?\*\*)/g);
         return (
             <p key={i} className="mb-2 text-sm opacity-90 leading-relaxed">
                 {parts.map((part, index) => {
                     if (part.startsWith('**') && part.endsWith('**')) {
                         return <strong key={index} className="text-white">{part.slice(2, -2)}</strong>;
                     }
                     return part;
                 })}
             </p>
         );
    });
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className={`col-span-1 flex flex-col gap-4 p-6 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20`}>
           <h3 className={`text-xl font-bold ${style.accentColor}`}>Configuration</h3>
           
           <div className="space-y-2">
               <label className="text-xs font-bold opacity-70">Custom Logic Instruction</label>
               <textarea 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="w-full h-24 bg-white/10 border border-white/20 rounded-lg p-3 text-sm focus:outline-none"
               />
           </div>

           <div className="space-y-2">
               <label className="text-xs font-bold opacity-70">Data Source (Context)</label>
               <textarea 
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-3 text-sm focus:outline-none font-mono"
               />
           </div>

           <button 
             onClick={handleProcess}
             disabled={loading}
             className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${style.bgGradient} text-white shadow-lg`}
           >
               {loading ? <RefreshCw className="animate-spin w-4 h-4"/> : <Bot className="w-4 h-4"/>}
               Execute Smart Replace
           </button>
       </div>

       <div className={`col-span-1 p-6 rounded-2xl ${style.panelColor} backdrop-blur-md border border-white/20 flex flex-col`}>
           <h3 className="font-bold opacity-70 mb-4">Template Input</h3>
           <textarea 
               value={template}
               onChange={(e) => setTemplate(e.target.value)}
               className="flex-1 w-full bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none"
           />
       </div>

       <div className="col-span-1 flex items-center justify-center hidden lg:flex">
            <ArrowRight className={`w-8 h-8 ${style.accentColor} opacity-50`} />
       </div>

       <div className={`col-span-1 lg:col-start-3 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex flex-col`}>
           <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold opacity-70 text-green-400">Generated Output</h3>
                {output && (
                    <div className="flex gap-1">
                        <button 
                             onClick={() => setViewMode(prev => prev === 'markdown' ? 'text' : 'markdown')} 
                             className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-white" 
                             title={viewMode === 'markdown' ? "View Raw Text" : "View Markdown"}
                        >
                             {viewMode === 'markdown' ? <Code className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                        </button>
                        <button onClick={copyToClipboard} className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-white" title="Copy">
                            {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>}
                        </button>
                        <button onClick={() => downloadContent(output, 'smart-replace', 'md')} className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-white" title="MD">
                            <Download className="w-3 h-3"/>
                        </button>
                        <button onClick={() => downloadContent(output, 'smart-replace', 'txt')} className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-white" title="TXT">
                            <FileText className="w-3 h-3"/>
                        </button>
                    </div>
                )}
           </div>
           
           {output ? (
               <div className="flex-1 w-full bg-transparent border-none p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto">
                   {viewMode === 'text' ? output : renderMarkdown(output)}
               </div>
           ) : (
               <div className="flex-1 flex items-center justify-center opacity-30 text-xs">
                   Result will appear here...
               </div>
           )}
       </div>
    </div>
  );
};