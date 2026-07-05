import networkx as nx
from app.db.session import SessionLocal
from app.db.models import Entity, Document

def build_graph() -> nx.Graph:
    db = SessionLocal()
    G = nx.Graph()

    entities = db.query(Entity).all()
    doc_entities = {}
    for e in entities:
        doc_entities.setdefault(e.document_id, []).append(e)

    for doc_id, ents in doc_entities.items():
        doc = db.query(Document).filter(Document.id == doc_id).first()
        for e in ents:
            node_id = f"{e.entity_type}:{e.entity_value}"
            G.add_node(node_id, type=e.entity_type, label=e.entity_value)
        for i in range(len(ents)):
            for j in range(i + 1, len(ents)):
                n1 = f"{ents[i].entity_type}:{ents[i].entity_value}"
                n2 = f"{ents[j].entity_type}:{ents[j].entity_value}"
                if G.has_edge(n1, n2):
                    G[n1][n2]["weight"] += 1
                    G[n1][n2]["documents"].append(doc.filename)
                else:
                    G.add_edge(n1, n2, weight=1, documents=[doc.filename])
    db.close()
    return G

def graph_to_json(G: nx.Graph) -> dict:
    nodes = [{"id": n, "label": d["label"], "type": d["type"]} for n, d in G.nodes(data=True)]
    edges = [{"source": u, "target": v, "weight": d["weight"], "documents": d["documents"]}
              for u, v, d in G.edges(data=True)]
    return {"nodes": nodes, "edges": edges}

def get_neighborhood(G: nx.Graph, node_label: str, entity_type: str = "equipment", depth: int = 1):
    node_id = f"{entity_type}:{node_label}"
    if node_id not in G:
        return {"nodes": [], "edges": []}
    subgraph_nodes = set([node_id])
    frontier = {node_id}
    for _ in range(depth):
        next_frontier = set()
        for n in frontier:
            next_frontier |= set(G.neighbors(n))
        subgraph_nodes |= next_frontier
        frontier = next_frontier
    sub = G.subgraph(subgraph_nodes)
    return graph_to_json(sub)