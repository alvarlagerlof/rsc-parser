import { RscChunkMessage } from "../stream/message";
import {
  useFilterMessagesByEndTime,
  useGroupedMessages,
} from "../stream/hooks";
import { TimeScrubber, useTimeScrubber } from "../stream/TimeScrubber";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";
import { PathTabs, usePathTabs } from "../tabs/path/PathTabs";
import { RowTabs } from "../tabs/row/RowTabs";
import * as Ariakit from "@ariakit/react";
import { RawStream } from "../stream/RawStream";
import { RowStream } from "../stream/RowStream";
import {
  Chunk,
  FlightResponse,
  createFromJSONCallback,
  isParsedObject,
  processBinaryChunk,
} from "../react/ReactFlightClient";
import { createStringDecoder } from "../react/ReactFlightClientConfigBrowser";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function StreamViewer({ messages }: { messages: RscChunkMessage[] }) {
  const defaultSelectedId = "tree";
  const tab = Ariakit.useTabStore({ defaultSelectedId });

  const timeScrubber = useTimeScrubber(messages, {
    follow: true,
  });

  const timeFilteredMessages = useFilterMessagesByEndTime(
    messages,
    timeScrubber.endTime,
  );
  const groupedMessages = useGroupedMessages(timeFilteredMessages);

  const pathTabs = usePathTabs(timeFilteredMessages, {
    follow: false,
  });

  const messagesForCurrentTab = pathTabs.currentTab
    ? groupedMessages.get(pathTabs.currentTab) ?? []
    : [];

  return (
    <div className="flex h-full min-h-full flex-col gap-4">
      <TimeScrubber {...timeScrubber} />

      <PathTabs {...pathTabs}>
        {!pathTabs.currentTab ? (
          <span className="dark:text-white">Please select a url</span>
        ) : (
          <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
            <div className="flex flex-row items-center justify-between">
              {messagesForCurrentTab.length === 0 ? (
                <span className="dark:text-white">
                  No data for current time frame, please select a url
                </span>
              ) : (
                <span className="dark:text-white">
                  Data from {messagesForCurrentTab.length} fetch chunk
                  {messagesForCurrentTab.length === 1 ? "" : "s"}
                </span>
              )}

              <Ariakit.TabList
                store={tab}
                aria-label="Render modes"
                className="flex flex-row gap-2"
              >
                <Ariakit.Tab
                  id="tree"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:text-white dark:aria-selected:text-black"
                >
                  Tree
                </Ariakit.Tab>
                <Ariakit.Tab
                  id="parsed"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:text-white dark:aria-selected:text-black"
                >
                  Parsed
                </Ariakit.Tab>
                <Ariakit.Tab
                  id="rows"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:text-white dark:aria-selected:text-black"
                >
                  Rows
                </Ariakit.Tab>
                <Ariakit.Tab
                  id="raw"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:text-white dark:aria-selected:text-black"
                >
                  Raw
                </Ariakit.Tab>
              </Ariakit.TabList>
            </div>
            <div>
              <Ariakit.TabPanel store={tab} tabId={defaultSelectedId}>
                <DebugTree messages={messagesForCurrentTab} />
              </Ariakit.TabPanel>
              <Ariakit.TabPanel store={tab}>
                <DebugRaw messages={messagesForCurrentTab} />
              </Ariakit.TabPanel>

              <Ariakit.TabPanel store={tab}>
                <RowStream messages={messagesForCurrentTab} />
              </Ariakit.TabPanel>
              {/* <Ariakit.TabPanel store={tab} tabId={defaultSelectedId}>
                <RowTabs
                  payload={messagesForCurrentTab
                    .map((message) => message.data.chunkValue)
                    .join()}
                />
              </Ariakit.TabPanel>
              <Ariakit.TabPanel store={tab}>
                <RowStream messages={messagesForCurrentTab} />
              </Ariakit.TabPanel>
              <Ariakit.TabPanel store={tab}>
                <RawStream messages={messagesForCurrentTab} />
              </Ariakit.TabPanel> */}
            </div>
          </ErrorBoundary>
        )}
      </PathTabs>
    </div>
  );
}

function messagesToResponse(messages: RscChunkMessage[]) {
  if (messages.length === 0) {
    return null;
  }

  const responseBuffer: Array<Uint8Array> = [];

  for (const [index, message] of messages.entries()) {
    responseBuffer[index] = new Uint8Array(
      Object.keys(message.data.chunkValue).length,
    );
    for (const [key, value] of Object.entries(message.data.chunkValue)) {
      responseBuffer[index][Number(key)] = Number(value);
    }
  }

  // for (let i = 0; i < messages.length; i++) {
  //   responseBuffer[i] = new Uint8Array(
  //     Object.keys(messages[i].data.chunkValue).length,
  //   );
  //   for (let n = 0; n < messages[i].data.chunkValue.length; n++) {
  //     responseBuffer[i][n] = Number(messages[i].data.chunkValue[n]);
  //   }
  // }

  const response = {
    _buffer: [],
    _rowID: 0,
    _rowTag: 0,
    _rowLength: 0,
    _rowState: 0,
    _stringDecoder: createStringDecoder(),
    _chunks: [] as FlightResponse["_chunks"],
  } satisfies FlightResponse;

  response._fromJSON = createFromJSONCallback(response);

  // const flightResponses = messages.map((message) => {
  //   return {
  //     _buffer: message.data.chunkValue,
  //     _rowID: message.data.chunkId,
  //     _rowLength: 1
  //   } satisfies FlightResponse
  // })

  for (const buffer of responseBuffer) {
    processBinaryChunk(response, buffer);
  }

  // for (let i = 0; i < responseBuffer.length; i++) {
  //   processBinaryChunk(response, responseBuffer[i]);
  // }

  return response;
}

function DebugRaw({ messages }: { messages: RscChunkMessage[] }) {
  const response = messagesToResponse(messages);

  return (
    <>
      <RowTabs chunks={response._chunks} />

      {/* <p>Test:</p>
      {response._chunks.map((chunk) => (
        <pre>{JSON.stringify(chunk.row, null, 2)}</pre>
      ))} */}
      {/*
      <p>Response:</p>
      <pre>{JSON.stringify(response, null, 2)}</pre> */}
      {/*
      <p>Response:</p>
      <pre>{JSON.stringify(response, null, 2)}</pre>

      <p>Raw:</p>
      <pre>{JSON.stringify(messages, null, 2)}</pre> */}
    </>
  );
}

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
    context.moveTo(link.source.x, link.source.y);
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

export const NetworkDiagram = ({
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

function DebugTree({ messages }: { messages: RscChunkMessage[] }) {
  const response = messagesToResponse(messages);

  if (!response) {
    return null;
  }

  const nodes = response._chunks.map((chunk) => {
    return {
      id: chunk.id,
    };
  });

  const links = getLinks(response._chunks, "0");

  const data = {
    nodes,
    links,
  } satisfies Data;

  return (
    <>
      {/* <pre>{JSON.stringify(nodes, null, 2)}</pre>
      <pre>{JSON.stringify(links, null, 2)}</pre> */}
      <NetworkDiagram width={700} height={700} data={data} />
    </>
  );
}
