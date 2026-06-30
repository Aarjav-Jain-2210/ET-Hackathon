# NexusAI: Unified Asset & Operations Brain 🏭

![NexusAI Banner](https://img.shields.io/badge/Status-Hackathon_Prototype_Complete-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Next.js-FastAPI-ChromaDB-blue?style=for-the-badge)

NexusAI is an Agentic Knowledge platform designed to ingest, parse, and structure scattered industrial documents into a unified, actionable intelligence hub for field technicians and engineers. Built for the **AI for Industrial Knowledge Intelligence** hackathon challenge.

## 🚀 The Problem
Professionals in asset-intensive industries spend up to 35% of their time searching across disconnected systems for engineering drawings, maintenance records, and standard operating procedures. As experienced personnel retire, critical undocumented operational knowledge is lost. 

## 💡 Our Solution
NexusAI eliminates knowledge fragmentation by building a unified, queryable knowledge graph and RAG (Retrieval-Augmented Generation) copilot. 

### Core Features
- **Universal Document Ingestion**: Upload raw PDF maintenance logs and equipment manuals. The system uses `PyMuPDF` to instantly parse and extract text.
- **Entity Extraction**: Automatically identifies critical entities such as Equipment Tags (e.g., `P-101`) and Inspection Dates using intelligent pipelines.
- **Expert Copilot Chat**: A conversational AI interface that field workers can use to ask natural language questions (e.g., "When was the last maintenance on Pump P-101?").
- **Retrieval-Augmented Generation (RAG)**: Built with **ChromaDB** and **SentenceTransformers** (`all-MiniLM-L6-v2`) to perform semantic search across the entire document corpus and provide accurate, cited answers.
- **Dynamic Knowledge Graph**: Uses **NetworkX** and **React Force Graph 2D** to map and visualize complex relationships between documents, equipment tags, and dates.

## 🏗️ Architecture & Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js (React), TailwindCSS, TypeScript, Lucide Icons, React Force Graph 2D |
| **Backend API** | Python, FastAPI, Uvicorn |
| **AI & Data** | ChromaDB (Vector Search), SentenceTransformers (Embeddings), NetworkX (Knowledge Graph), PyMuPDF (Parsing) |

## ⚙️ Getting Started (Local Development)

### 1. Start the Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt # Or install packages manually: fastapi uvicorn PyMuPDF chromadb sentence-transformers networkx python-multipart
python3 main.py
```
The backend API will run on `http://localhost:8000`. Note: On the first run, the SentenceTransformer embedding model (~80MB) will be downloaded automatically.

### 2. Start the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## 📈 Business Impact
- **Reduced Unplanned Downtime**: Instantly surfacing relevant maintenance history during a failure event drastically reduces Mean Time to Repair (MTTR).
- **Preserved Institutional Knowledge**: Captures the undocumented fixes of retiring engineers into a structured graph.
- **Increased Productivity**: Eliminates the 35% time waste spent searching through scattered folders.

---
