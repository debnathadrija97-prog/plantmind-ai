import os
from app.db.session import SessionLocal
from app.db.models import Document, Entity, Chunk
from app.ingestion.parser import parse_pdf
from app.ingestion.entities import extract_entities
from app.rag.embed import embed_text, chunk_text

def guess_doc_type(filename: str) -> str:
    fname = filename.lower()
    if "maintenance" in fname: return "maintenance_log"
    if "inspection" in fname: return "inspection_report"
    if "incident" in fname: return "incident_report"
    if "vendor" in fname: return "vendor_record"
    return "other"

def ingest_folder(folder_path: str):
    db = SessionLocal()
    for fname in os.listdir(folder_path):
        if not fname.endswith(".pdf"):
            continue
        filepath = os.path.join(folder_path, fname)
        pages = parse_pdf(filepath)
        full_text = "\n".join(p["text"] for p in pages)

        doc = Document(filename=fname, doc_type=guess_doc_type(fname), raw_text=full_text)
        db.add(doc)
        db.commit()
        db.refresh(doc)

        for page in pages:
            entities = extract_entities(page["text"])
            for e in entities:
                db.add(Entity(
                    document_id=doc.id,
                    entity_type=e["entity_type"],
                    entity_value=e["entity_value"],
                    page_number=page["page_number"]
                ))

        chunks = chunk_text(full_text)
        for chunk in chunks:
            vec = embed_text(chunk)
            db.add(Chunk(document_id=doc.id, chunk_text=chunk, page_number=1, embedding=vec))

        db.commit()
        print(f"Ingested {fname}: {len(pages)} pages, {len(chunks)} chunks")
    db.close()

if __name__ == "__main__":
    ingest_folder("C:/Users/Adrija/Desktop/pdf_docs")