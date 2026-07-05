import re
import spacy

nlp = spacy.load("en_core_web_sm")
EQUIPMENT_PATTERN = re.compile(r"\b[A-Z]{2,4}-\d{2,4}\b")

def extract_entities(text: str) -> list[dict]:
    results = []
    for match in EQUIPMENT_PATTERN.finditer(text):
        results.append({"entity_type": "equipment", "entity_value": match.group()})

    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            results.append({"entity_type": "person", "entity_value": ent.text})
        elif ent.label_ == "ORG":
            results.append({"entity_type": "vendor", "entity_value": ent.text})
        elif ent.label_ == "DATE":
            results.append({"entity_type": "date", "entity_value": ent.text})
    return results