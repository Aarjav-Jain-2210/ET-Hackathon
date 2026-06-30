import Link from 'next/link';
import { Home, MessageSquare, Database, Settings, HardHat } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 border-r border-gray-800">
      <div className="p-6 flex items-center gap-3">
        <HardHat className="w-8 h-8 text-blue-500" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">NexusAI</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-8">
        <NavItem id="dashboard" icon={<Home size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem id="chat" icon={<MessageSquare size={20}/>} label="Expert Copilot" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <NavItem id="documents" icon={<Database size={20}/>} label="Knowledge Base" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <NavItem id="settings" icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { id: string, icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
