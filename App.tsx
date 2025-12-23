import React, { useState, useEffect } from 'react';
import { FileText, Layers, RefreshCw, Moon, Sun, Key, NotebookPen, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { ARTIST_STYLES } from './constants';
import { ArtistStyle, AppTab, Language, AnalysisConfig } from './types';
import { Jackpot } from './components/Jackpot';
import { FileIntelligence } from './components/FileIntelligence';
import { MultiFileIntelligence } from './components/MultiFileIntelligence';
import { SmartReplace } from './components/SmartReplace';
import { AINoteKeeper } from './components/AINoteKeeper';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SINGLE_FILE);
  const [style, setStyle] = useState<ArtistStyle>(ARTIST_STYLES[0]);
  const [isDark, setIsDark] = useState(true);
  
  // Initialize API Key from env if available, otherwise empty
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  
  const [config, setConfig] = useState<AnalysisConfig>({
    model: 'gemini-3-flash-preview',
    language: Language.ENGLISH
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Apply basic body styles based on theme
  useEffect(() => {
    document.body.className = isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900';
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden relative ${style.fontFamily}`}>
      
      {/* Dynamic Background */}
      <div className={`fixed inset-0 opacity-20 transition-all duration-1000 ${style.bgGradient} blur-3xl scale-110 pointer-events-none`} />
      
      {/* Main Layout */}
      <main className="relative z-10 flex h-screen p-2 lg:p-4 gap-2 lg:gap-4">
        
        {/* Sidebar */}
        <aside 
            className={`
                flex-shrink-0 flex flex-col rounded-2xl ${style.panelColor} backdrop-blur-xl border border-white/10 
                transition-all duration-500 shadow-2xl relative
                ${isSidebarOpen ? 'w-64' : 'w-20'}
            `}
        >
            {/* Collapse Toggle */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute -right-3 top-8 bg-white text-black p-1 rounded-full shadow-md z-20 hover:scale-110 transition-transform"
            >
                {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* Header */}
            <div className={`p-6 border-b border-white/10 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                {isSidebarOpen ? (
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tighter">AuditFlow</h1>
                        <span className={`text-[9px] uppercase tracking-[0.3em] font-bold ${style.accentColor}`}>Masterpiece</span>
                    </div>
                ) : (
                    <div className="font-bold text-xl">AF</div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                <NavBtn 
                    active={activeTab === AppTab.SINGLE_FILE} 
                    onClick={() => setActiveTab(AppTab.SINGLE_FILE)} 
                    icon={<FileText />} 
                    label="File Intelligence" 
                    isOpen={isSidebarOpen}
                />
                <NavBtn 
                    active={activeTab === AppTab.MULTI_FILE} 
                    onClick={() => setActiveTab(AppTab.MULTI_FILE)} 
                    icon={<Layers />} 
                    label="Multi-Doc Synthesis" 
                    isOpen={isSidebarOpen}
                />
                <NavBtn 
                    active={activeTab === AppTab.SMART_REPLACE} 
                    onClick={() => setActiveTab(AppTab.SMART_REPLACE)} 
                    icon={<RefreshCw />} 
                    label="Smart Replace" 
                    isOpen={isSidebarOpen}
                />
                <NavBtn 
                    active={activeTab === AppTab.NOTE_KEEPER} 
                    onClick={() => setActiveTab(AppTab.NOTE_KEEPER)} 
                    icon={<NotebookPen />} 
                    label="AI Note Keeper" 
                    isOpen={isSidebarOpen}
                />
            </nav>

            {/* Settings */}
            <div className="p-4 border-t border-white/10 space-y-4">
                 
                 {/* API Key Input - Only show if not in ENV */}
                 {!process.env.API_KEY && isSidebarOpen && (
                     <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-xs opacity-50 px-1">
                            <Key size={12}/> API Access Key
                        </div>
                        <input 
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Paste Key..."
                            className="w-full bg-transparent border-b border-white/20 text-xs py-1 focus:outline-none focus:border-white/50"
                        />
                     </div>
                 )}

                 <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'flex-col gap-2'} px-1`}>
                     <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Toggle Theme">
                         {isDark ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                     </button>
                     <button onClick={() => setConfig({...config, language: config.language === Language.ENGLISH ? Language.TRADITIONAL_CHINESE : Language.ENGLISH})} className="p-2 rounded-lg hover:bg-white/10 transition-colors font-bold text-xs w-10 h-10 flex items-center justify-center" title="Toggle Language">
                         {config.language === Language.ENGLISH ? 'EN' : '繁'}
                     </button>
                 </div>
                 
                 {/* Jackpot - Only show when open */}
                 {isSidebarOpen && (
                     <div className="pt-2">
                         <Jackpot currentStyle={style} onSelectStyle={setStyle} isDark={isDark} />
                     </div>
                 )}
            </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-hidden relative">
            {activeTab === AppTab.SINGLE_FILE && (
                <FileIntelligence apiKey={apiKey} config={config} style={style} setConfig={setConfig} />
            )}
            {activeTab === AppTab.MULTI_FILE && (
                <MultiFileIntelligence apiKey={apiKey} config={config} style={style} setConfig={setConfig} />
            )}
            {activeTab === AppTab.SMART_REPLACE && (
                <SmartReplace apiKey={apiKey} config={config} style={style} />
            )}
            {activeTab === AppTab.NOTE_KEEPER && (
                <AINoteKeeper apiKey={apiKey} config={config} style={style} setConfig={setConfig} />
            )}
        </section>

      </main>
    </div>
  );
}

const NavBtn = ({ active, onClick, icon, label, isOpen }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, isOpen: boolean }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center ${isOpen ? 'gap-4 px-3' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-300
            ${active ? 'bg-white/20 shadow-lg font-bold' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}
        `}
        title={!isOpen ? label : ''}
    >
        <span className={`${active ? 'text-white' : ''} ${!isOpen && active ? 'scale-125' : ''} transition-transform`}>{icon}</span>
        {isOpen && <span className="text-sm">{label}</span>}
    </button>
);

export default App;