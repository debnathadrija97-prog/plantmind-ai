from app.db.session import SessionLocal
from app.db.models import Document, Entity
from datetime import datetime

def get_dashboard_summary():
    db = SessionLocal()
    incident_docs = db.query(Document).filter(Document.doc_type == "incident_report").all()
    inspection_docs = db.query(Document).filter(Document.doc_type == "inspection_report").all()

    at_risk_equipment = set()
    for doc in incident_docs:
        equips = db.query(Entity).filter(
            Entity.document_id == doc.id, Entity.entity_type == "equipment"
        ).all()
        at_risk_equipment.update([e.entity_value for e in equips])

    total_docs = db.query(Document).count()
    health_score = max(0, 100 - len(at_risk_equipment) * 8 - len(incident_docs) * 5)

    recent_incidents = [{"filename": d.filename, "uploaded_at": str(d.uploaded_at)}
                          for d in sorted(incident_docs, key=lambda x: x.uploaded_at, reverse=True)[:5]]

    db.close()
    return {
        "plant_health_score": health_score,
        "active_risks": list(at_risk_equipment),
        "recent_incidents": recent_incidents,
        "total_documents_indexed": total_docs,
        "compliance_alerts": 1
    }