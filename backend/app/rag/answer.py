import os
import re
from groq import Groq
from dotenv import load_dotenv
from app.rag.retrieve import retrieve_chunks
from app.graph.builder import build_graph, get_neighborhood

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are an industrial operations analyst assistant called PlantMind AI.
You are given retrieved document excerpts and related knowledge graph context.
Answer the user's question using ONLY the provided evidence. Structure your answer as:

**What happened:** (facts from the documents)
**Why it happened:** (root cause reasoning, only if evidence supports it)
**What's connected:** (related equipment, vendors, or incidents from the graph context)
**Recommended action:** (grounded strictly in the evidence provided — describe it as a
recommendation based on retrieved evidence, never as a prediction or forecast)

After each factual claim, cite the source in this format: [filename, page X].
If the evidence doesn't support a section, say so briefly rather than inventing content.
"""

def generate_answer(query: str) -> dict:
    chunks = retrieve_chunks(query, top_k=6)
    context_text = "\n\n".join([f"[{c['filename']}, page {c['page']}]: {c['text']}" for c in chunks])

    equipment_ids = re.findall(r"\b[A-Z]{2,4}-\d{2,4}\b", query)
    graph_context = ""
    used_nodes = []
    if equipment_ids:
        G = build_graph()
        for eq in equipment_ids:
            neighborhood = get_neighborhood(G, eq)
            used_nodes.extend([n["id"] for n in neighborhood["nodes"]])
            graph_context += f"\nGraph connections for {eq}: " + \
                ", ".join([n["label"] for n in neighborhood["nodes"]])

    full_context = f"DOCUMENT EXCERPTS:\n{context_text}\n\nGRAPH CONTEXT:{graph_context}"

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"{full_context}\n\nQuestion: {query}"}
        ],
        max_tokens=800
    )

    answer_text = completion.choices[0].message.content
    sources = list(set([c["filename"] for c in chunks]))
    return {"answer": answer_text, "sources": sources, "graph_nodes_used": used_nodes}