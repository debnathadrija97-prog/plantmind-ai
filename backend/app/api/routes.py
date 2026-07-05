from fastapi import APIRouter
from pydantic import BaseModel
from app.graph.builder import build_graph, graph_to_json, get_neighborhood
from app.rag.answer import generate_answer
from app.api.dashboard import get_dashboard_summary

router = APIRouter()

@router.get("/graph")
def get_full_graph():
    G = build_graph()
    return graph_to_json(G)

@router.get("/graph/neighborhood/{entity_value}")
def get_graph_neighborhood(entity_value: str, entity_type: str = "equipment"):
    G = build_graph()
    return get_neighborhood(G, entity_value, entity_type)

class QueryRequest(BaseModel):
    question: str

@router.post("/ask")
def ask(req: QueryRequest):
    return generate_answer(req.question)

@router.get("/dashboard/summary")
def dashboard_summary():
    return get_dashboard_summary()