type SharedData = {
  data: {
    tabId: number;
    requestId: string;
    timestamp: number;
  };
};

export type RscRequestEvent = SharedData & {
  type: "RSC_REQUEST";
  data: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
};

export function isRscRequestEvent(event: unknown): event is RscRequestEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "type" in event &&
    event.type === "RSC_REQUEST"
  );
}

export type RscResponseEvent = SharedData & {
  type: "RSC_RESPONSE";
  data: {
    status: number;
    headers: Record<string, string>;
  };
};

export function isRscResponseEvent(event: unknown): event is RscResponseEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "type" in event &&
    event.type === "RSC_RESPONSE"
  );
}

export type RscChunkEvent = SharedData & {
  type: "RSC_CHUNK";
  data: {
    chunkValue: number[];
  };
};

export function isRscChunkEvent(event: unknown): event is RscChunkEvent {
  return (
    typeof event === "object" &&
    event !== null &&
    "type" in event &&
    event.type === "RSC_CHUNK"
  );
}

export type RscEvent = RscRequestEvent | RscResponseEvent | RscChunkEvent;

export function isRscEvent(event: unknown): event is RscEvent {
  return (
    isRscRequestEvent(event) ||
    isRscResponseEvent(event) ||
    isRscChunkEvent(event)
  );
}
