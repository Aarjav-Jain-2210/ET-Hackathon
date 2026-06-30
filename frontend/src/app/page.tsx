'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Chat from '@/components/Chat';

import KnowledgeBase from '@/components/KnowledgeBase';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <main className="min-h-screen bg-[#0B0F19] flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-64 flex-1">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'chat' && <div className="p-8"><Chat /></div>}
        {activeTab === 'documents' && <div className="p-8"><KnowledgeBase /></div>}
        {activeTab === 'settings' && <div className="p-8 text-white"><h1 className="text-3xl font-bold mb-4">Settings</h1><p className="text-gray-400">Settings panel coming soon...</p></div>}
      </div>
    </main>
  );
}
