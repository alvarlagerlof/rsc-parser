export type StartRecordingEvent = {
  type: 'START_RECORDING';
  data: {
    tabId: number;
  };
};

export function isStartRecordingEvent(
  event: unknown,
): event is StartRecordingEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'START_RECORDING'
  );
}

export type StopRecordingEvent = {
  type: 'STOP_RECORDING';
  data: {
    tabId: number;
  };
};

export function isStopRecordingEvent(
  event: unknown,
): event is StopRecordingEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'STOP_RECORDING'
  );
}

export type ReadNextJsScriptTagsEvent = {
  type: 'READ_NEXT_JS_SCRIPT_TAGS';
  data: {
    tabId: number;
  };
};

export function isReadNextJsScriptTagsEvent(
  event: unknown,
): event is ReadNextJsScriptTagsEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'READ_NEXT_JS_SCRIPT_TAGS'
  );
}

type RscEventSharedData = {
  data: {
    tabId: number;
    requestId: string;
    timestamp: number;
  };
};

export type RscRequestEvent = RscEventSharedData & {
  type: 'RSC_REQUEST';
  data: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
};

export function isRscRequestEvent(event: unknown): event is RscRequestEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'RSC_REQUEST'
  );
}

export type RscResponseEvent = RscEventSharedData & {
  type: 'RSC_RESPONSE';
  data: {
    status: number;
    headers: Record<string, string>;
  };
};

export function isRscResponseEvent(event: unknown): event is RscResponseEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'RSC_RESPONSE'
  );
}

export type RscChunkEvent = RscEventSharedData & {
  type: 'RSC_CHUNK';
  data: {
    chunkValue: number[];
  };
};

export function isRscChunkEvent(event: unknown): event is RscChunkEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'RSC_CHUNK'
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

export type Event = StartRecordingEvent | StopRecordingEvent | RscEvent;

export function isEvent(event: unknown): event is Event {
  return (
    isStartRecordingEvent(event) ||
    isStopRecordingEvent(event) ||
    isRscEvent(event) ||
    isReadNextJsScriptTagsEvent(event)
  );
}
