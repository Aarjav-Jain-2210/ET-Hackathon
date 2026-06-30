'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Database } from 'lucide-react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function KnowledgeBase() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/graph');
        setGraphData(res.data);
      } catch (error) {
        console.error("Failed to fetch graph data", error);
      }
    };
    fetchGraph();
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    // Wait for a brief moment in case the layout shifts
    setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getNodeColor = (node: any) => {
    if (node.type === 'document') return '#3b82f6'; // blue
    if (node.type === 'equipment') return '#10b981'; // green
    if (node.type === 'date') return '#8b5cf6'; // purple
    return '#6b7280'; // gray
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
           <Database className="text-blue-500" /> Enterprise Knowledge Graph
        </h1>
        <p className="text-gray-400">Visualizing relationships between documents, equipment, and events.</p>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Documents</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Equipment Tags</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Dates</div>
        </div>
      </div>
      
      <div ref={containerRef} className="flex-1 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl relative">
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="label"
            nodeColor={getNodeColor}
            nodeRelSize={6}
            linkColor={() => '#4b5563'}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            backgroundColor="#111827"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No entities mapped yet. Please upload a document in the Dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
