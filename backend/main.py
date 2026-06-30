import re
import fitz # PyMuPDF
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import chromadb
from sentence_transformers import SentenceTransformer
try:
    import networkx as nx
    kg_enabled = True
except ImportError:
    kg_enabled = False

app = FastAPI(
    title="Industrial Knowledge Intelligence API",
    description="Backend for the Unified Asset & Operations Brain platform.",
    version="0.1.0"
)

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB and Embedding Model
print("Initializing ChromaDB and Embedding Model...")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="industrial_knowledge")
try:
    embed_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print("Warning: SentenceTransformer not available yet. Waiting for install.")
    embed_model = None

# Initialize Knowledge Graph
if kg_enabled:
    knowledge_graph = nx.Graph()

# Temporary in-memory store for prototype
documents_db = []

@app.get("/")
def read_root():
    return {"message": "Welcome to the Industrial Knowledge Intelligence API"}

def extract_entities(text: str):
    """
    Mock entity extraction using Regex for prototype.
    """
    equipment_tags = list(set(re.findall(r'[A-Z]-\d{3,4}', text)))
    dates = list(set(re.findall(r'\d{2,4}-\d{2}-\d{2,4}', text)))
    return {
        "equipment": equipment_tags,
        "dates": dates
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Endpoint for document ingestion.
    Parses PDF, extracts text, performs entity extraction, and adds to ChromaDB vector store.
    """
    if not file.filename.endswith('.pdf'):
        return {"error": "Only PDF files are supported currently."}
    
    contents = await file.read()
    
    # Process PDF with PyMuPDF
    text = ""
    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        return {"error": f"Failed to parse PDF: {str(e)}"}
    
    # Extract entities
    entities = extract_entities(text)
    
    # Update Knowledge Graph
    if kg_enabled:
        doc_node_id = file.filename
        knowledge_graph.add_node(doc_node_id, type="document", label=file.filename)
        
        for eq in entities.get("equipment", []):
            eq_node_id = f"EQ_{eq}"
            if not knowledge_graph.has_node(eq_node_id):
                knowledge_graph.add_node(eq_node_id, type="equipment", label=eq)
            knowledge_graph.add_edge(doc_node_id, eq_node_id, label="MENTIONS")
            
        for d in entities.get("dates", []):
            date_node_id = f"DATE_{d}"
            if not knowledge_graph.has_node(date_node_id):
                knowledge_graph.add_node(date_node_id, type="date", label=d)
            knowledge_graph.add_edge(doc_node_id, date_node_id, label="OCCURRED_ON")
    
    # Vector DB Indexing (RAG Pipeline)
    if embed_model:
        # Simple chunking
        chunk_size = 100
        words = text.split()
        chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
        
        # Generate embeddings and store in Chroma
        embeddings = embed_model.encode(chunks).tolist()
        ids = [f"{file.filename}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"filename": file.filename, "type": "document"} for _ in range(len(chunks))]
        
        if chunks:
            collection.add(
                embeddings=embeddings,
                documents=chunks,
                metadatas=metadatas,
                ids=ids
            )
    
    # Save to mock DB for dashboard
    doc_entry = {
        "filename": file.filename,
        "text_preview": text[:200] + "..." if len(text) > 200 else text,
        "entities": entities
    }
    documents_db.append(doc_entry)
    
    return {
        "filename": file.filename,
        "message": "File uploaded and processed successfully into Vector DB",
        "entities_extracted": entities
    }

@app.get("/api/documents")
def get_documents():
    return {"documents": documents_db}

@app.get("/api/graph")
def get_graph():
    if not kg_enabled:
        return {"nodes": [], "links": []}
    
    nodes = [{"id": n, **knowledge_graph.nodes[n]} for n in knowledge_graph.nodes()]
    links = [{"source": u, "target": v, "label": knowledge_graph.edges[u, v].get('label', '')} for u, v in knowledge_graph.edges()]
    
    return {"nodes": nodes, "links": links}

@app.post("/api/chat")
async def chat(query: dict):
    """
    Endpoint for Expert Knowledge Copilot.
    Uses Vector Search (RAG) to find relevant context.
    """
    user_message = query.get("message", "")
    sources = []
    response = ""
    
    if embed_model:
        # Query ChromaDB
        query_embedding = embed_model.encode([user_message]).tolist()
        try:
            results = collection.query(
                query_embeddings=query_embedding,
                n_results=3
            )
            
            retrieved_text = ""
            if results['documents'] and results['documents'][0]:
                for i in range(len(results['documents'][0])):
                    sources.append(results['metadatas'][0][i]['filename'])
                    retrieved_text += f"- {results['documents'][0][i]}\n\n"
                    
            sources = list(set(sources)) # Unique sources
            
            if not retrieved_text:
                response = "I couldn't find any relevant information in the knowledge base."
            else:
                # Mock LLM generation using the context
                response = f"Based on our industrial knowledge base, here is the relevant context I found for your query:\n\n{retrieved_text}\n\n(Note: In production, an LLM would synthesize this context into a natural language response.)"
        except Exception as e:
            response = f"Error querying vector database: {str(e)}"
    else:
        response = "Vector DB and embeddings are not initialized yet."
            
    return {"response": response, "sources": sources}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
