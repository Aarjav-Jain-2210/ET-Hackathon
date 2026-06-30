import { FileUp, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

type Document = {
  filename: string;
  text_preview: string;
  entities: any;
};

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/documents');
      setDocuments(res.data.documents);
    } catch (e) {
      console.error("Failed to fetch documents", e);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchDocuments();
      alert(`Successfully uploaded ${file.name}`);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Ensure the backend is running and it is a valid PDF.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Operations Brain Overview</h1>
        <p className="text-gray-400">System health, document ingestion pipeline, and active alerts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Documents Processed" value={(12450 + documents.length).toString()} change={`+${documents.length} this session`} icon={<FileUp size={24} className="text-blue-500"/>} />
        <StatCard title="Active Knowledge Nodes" value="482.1k" change="+3.2k this week" icon={<Activity size={24} className="text-green-500"/>} />
        <StatCard title="Compliance Risks" value="3" change="-2 since last scan" icon={<AlertTriangle size={24} className="text-yellow-500"/>} alert />
        <StatCard title="System Status" value="Healthy" change="Last sync: Just now" icon={<CheckCircle size={24} className="text-teal-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Ingestion */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 col-span-2 shadow-lg h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Ingested Documents (Session)</h2>
          {documents.length === 0 ? (
            <div className="text-gray-500 text-center py-10">No documents uploaded in this session yet.</div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc, i) => (
                <div key={i} className="flex flex-col p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-green-900/50 text-green-500">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{doc.filename}</p>
                      </div>
                    </div>
                  </div>
                  {doc.entities && (
                     <div className="mt-2 flex gap-2 flex-wrap">
                       {doc.entities.equipment?.map((eq: string, j: number) => (
                         <span key={j} className="text-xs px-2 py-1 bg-blue-900/40 text-blue-400 rounded-md">Tag: {eq}</span>
                       ))}
                       {doc.entities.dates?.map((d: string, j: number) => (
                         <span key={j} className="text-xs px-2 py-1 bg-purple-900/40 text-purple-400 rounded-md">Date: {d}</span>
                       ))}
                     </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            <button 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <FileUp size={20} />
              {isUploading ? 'Uploading & Parsing...' : 'Upload New PDF Document'}
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors border border-gray-700">
              <Activity size={20} />
              Run Compliance Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, alert }: { title: string, value: string, change: string, icon: React.ReactNode, alert?: boolean }) {
  return (
    <div className={`bg-gray-900 rounded-xl border ${alert ? 'border-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-gray-800 shadow-lg'} p-6 flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg">{icon}</div>
      </div>
      <p className={`text-sm ${alert ? 'text-yellow-500 font-medium' : 'text-gray-500'}`}>{change}</p>
    </div>
  );
}

