"use client";
import { useEffect, useState } from "react";
import { getGraph } from "../lib/api";

const typeColors = {
  equipment: "#a78bfa",
  person: "#e879f9",
  vendor: "#818cf8",
};

function isCleanLabel(label) {
  if (!label) return false;
  if (label.includes("\n")) return false;
  if (label.length > 25) return false;
  return true;
}

function buildComponents(nodes, edges) {
  const adjacency = {};
  nodes.forEach((n) => (adjacency[n.id] = []));
  edges.forEach((e) => {
    if (adjacency[e.source] && adjacency[e.target]) {
      adjacency[e.source].push(e.target);
      adjacency[e.target].push(e.source);
    }
  });

  const visited = new Set();
  const components = [];

  nodes.forEach((n) => {
    if (visited.has(n.id)) return;
    const queue = [n.id];
    const comp = [];
    visited.add(n.id);
    while (queue.length) {
      const current = queue.shift();
      comp.push(current);
      (adjacency[current] || []).forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      });
    }
    components.push(comp);
  });

  return components.sort((a, b) => b.length - a.length);
}

export default function GraphView() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    getGraph().then((data) => {
      const goodNodes = data.nodes.filter((n) => n.type !== "date" && isCleanLabel(n.label));
      const goodIds = new Set(goodNodes.map((n) => n.id));
      const goodEdges = data.edges.filter((e) => goodIds.has(e.source) && goodIds.has(e.target));
      setNodes(goodNodes);
      setEdges(goodEdges);
    });
  }, []);

  if (nodes.length === 0) {
    return <div className="p-8 text-violet-100">Loading graph...</div>;
  }

  const components = buildComponents(nodes, edges);
  const cols = 4;
  const cellWidth = 260;
  const cellHeight = 220;
  const positions = {};

  components.forEach((comp, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = col * cellWidth + cellWidth / 2 + 40;
    const cy = row * cellHeight + cellHeight / 2 + 40;

    if (comp.length === 1) {
      positions[comp[0]] = { x: cx, y: cy };
    } else {
      const radius = Math.min(75, 30 + comp.length * 10);
      comp.forEach((id, idx) => {
        const angle = (2 * Math.PI * idx) / comp.length;
        positions[id] = {
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        };
      });
    }
  });

  const rows = Math.ceil(components.length / cols);
  const svgWidth = cols * cellWidth + 80;
  const svgHeight = rows * cellHeight + 80;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2 text-violet-100">Knowledge Graph</h1>
      <p className="text-sm text-violet-300 mb-4">
        Violet = Equipment • Fuchsia = Person • Indigo = Vendor
      </p>
      <div
        className="bg-[#1e1b2e] border border-violet-800/40 rounded-2xl overflow-auto p-4"
        style={{ maxHeight: "650px" }}
      >
        <svg width={svgWidth} height={svgHeight}>
          {edges.map((e, i) => {
            const s = positions[e.source];
            const t = positions[e.target];
            if (!s || !t) return null;
            return (
              <line
                key={i}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke="rgba(167,139,250,0.35)"
                strokeWidth={1.5}
              />
            );
          })}
          {nodes.map((n) => {
            const pos = positions[n.id];
            if (!pos) return null;
            const color = typeColors[n.type] || "#c4b5fd";
            return (
              <g key={n.id}>
                <circle
                  cx={pos.x} cy={pos.y}
                  r={n.type === "equipment" ? 9 : 6}
                  fill={color} stroke="#1e1b2e" strokeWidth={2}
                />
                <text
                  x={pos.x + 12} y={pos.y + 4}
                  fontSize={12} fill="#ede9fe" fontFamily="Arial, sans-serif"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}