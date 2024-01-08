import { Chunk, isParsedObject } from "../react/ReactFlightClient";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Node extends d3.SimulationNodeDatum {
  id: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

export type Data = {
  nodes: Node[];
  links: Link[];
};

export const RADIUS = 12;

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[],
) => {
  context.clearRect(0, 0, width, height);

  // Draw the links first
  links.forEach((link) => {
    context.beginPath();
    // @ts-expect-error - d3 types are wrong
    context.moveTo(link.source.x, link.source.y);
    // @ts-expect-error - d3 types are wrong
    context.lineTo(link.target.x, link.target.y);
    context.strokeStyle = "#ffffff";
    context.stroke();
  });

  // Draw the nodes
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle = node.id === "0" ? "#002fca" : "#001a6e";
    context.fill();
    context.fillStyle = "#ffffff";
    context.fillText(node.id, node.x - 5, node.y + 4);
  });
};

export const Diagram = ({
  width,
  height,
  data,
}: {
  width: number;
  height: number;
  data: Data;
}) => {
  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links: Link[] = data.links.map((d) => ({ ...d }));
  const nodes: Node[] = data.nodes.map((d) => ({ ...d }));

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // set dimension of the canvas element
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    // run d3-force to find the position of nodes on the canvas
    d3.forceSimulation(nodes)

      // list of forces we apply to get node positions
      .force(
        "link",
        d3.forceLink<Node, Link>(links).id((d) => d.id),
      )
      .force("collide", d3.forceCollide().radius(RADIUS))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on("tick", () => {
        drawNetwork(context, width, height, nodes, links);
      });
  }, [width, height, nodes, links]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      />
    </div>
  );
};

function findReferencesInChunk(chunk: Chunk) {
  if (chunk.type !== "model") {
    return [];
  }

  const references: string[] = [];

  function walk(data: unknown) {
    if (isParsedObject(data)) {
      references.push(data.id);
      return;
    }

    if (Array.isArray(data)) {
      for (const value of data) {
        walk(value);
      }
      return;
    }

    if (typeof data == "object" && data !== null) {
      for (const value of Object.values(data)) {
        walk(value);
      }
    }
  }

  walk(chunk.value);

  return references;
}

function getChunkById(chunks: Chunk[], id: string) {
  return chunks.find((chunk) => chunk.id === id);
}

function getLinks(chunks: Chunk[], id: string) {
  const links: Link[] = [];

  function walk(id: string) {
    const chunk = getChunkById(chunks, id);
    if (!chunk) {
      return links;
    }

    const references = findReferencesInChunk(chunk);
    for (const reference of references) {
      links.push({
        source: id,
        target: reference,
      });

      walk(reference);
    }
  }

  walk(id);

  return links;
}

export function NetworkDiagram({ chunks }: { chunks: Chunk[] }) {
  const nodes: Node[] = chunks.map((chunk) => {
    return {
      id: chunk.id,
    };
  });

  const links = getLinks(chunks, "0");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = 700;
  const height = 700;

  useEffect(() => {
    // set dimension of the canvas element
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    // run d3-force to find the position of nodes on the canvas
    d3.forceSimulation(nodes)

      // list of forces we apply to get node positions
      .force(
        "link",
        d3.forceLink<Node, Link>(links).id((d) => d.id),
      )
      .force("collide", d3.forceCollide().radius(RADIUS))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on("tick", () => {
        drawNetwork(context, width, height, nodes, links);
      });
  }, [width, height, nodes, links]);

  return (
    <div>
      {/* <pre>{JSON.stringify(nodes, null, 2)}</pre>
        <pre>{JSON.stringify(links, null, 2)}</pre> */}
      <canvas
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      />
    </div>
  );
}
