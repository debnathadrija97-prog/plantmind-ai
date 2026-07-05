from app.db.session import SessionLocal
from app.db.models import Chunk, Document
from app.rag.embed import embed_text
from sqlalchemy import select

def retrieve_chunks(query: str, top_k: int = 5):
    db = SessionLocal()
    query_vec = embed_text(query)
    results = db.execute(
        select(Chunk, Document.filename)
        .join(Document, Chunk.document_id == Document.id)
        .order_by(Chunk.embedding.cosine_distance(query_vec))
        .limit(top_k)
    ).all()
    db.close()
    return [{"text": r[0].chunk_text, "filename": r[1], "page": r[0].page_number} for r in results]